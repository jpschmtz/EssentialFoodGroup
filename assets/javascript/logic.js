// Initialize Firebase
var config = {
	apiKey: "AIzaSyClhrtpSPee17KydLjp8_LR44ykijOqmR4",
	authDomain: "essential-food-group.firebaseapp.com",
	databaseURL: "https://essential-food-group.firebaseio.com",
	projectId: "essential-food-group",
	storageBucket: "essential-food-group.appspot.com",
	messagingSenderId: "971437057033"
};
	
firebase.initializeApp(config);

// Variables that refer to the firebase database and the recipe-searches branch
var database = firebase.database();
var searches = database.ref("/recipe-searches");
var results = database.ref("/recipe-results");
var exercise = database.ref("/exercise-calories") // seems to be working but should it have a / like the searches node ref?
var details = database.ref("/recipe-summary");
var ingredientList = database.ref("/ingredient-list");
var recipeImage = database.ref("/image");
var recipeTitle = database.ref("/recipe-title");
var instructions = database.ref("/instructions");
var fullIngList = [];
var calories;

// Define a search function once (globally) that we'll call on click (of search icon) & on enter key-press
function search() {
	var ingredient = $(".search").val().trim();
	console.log(ingredient);
	console.log("testing global function");
	$(".search").val("");
	// push search term to Firebase database
	searches.push(ingredient);
	// redirect to the list.html page
	location.href = "list.html";
};


// Landing page search functions
$(".clickSearch").on("click", function () {
	search();
});

$(".search").keyup(function () {
	var keyCode = (event.keyCode ? event.keyCode : event.which);
	if (keyCode == 13) {
		search();
	}
});

// List page search functions
$("#listSearch").on("click", function () {
	search();
});

$(".recipeSearch").keyup(function () {
	var keyCode = (event.keyCode ? event.keyCode : event.which);
	if (keyCode == 13) {
		search();
	}
});

// Pull search term from Firebase and feed into Spoonacular API for recipe search
searches.orderByKey().limitToLast(1).on("child_added", function (snapshot) {
	var ingredient = snapshot.val();

	console.log("Pulled from Firebase: " + ingredient);
	var baseURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients??number=5&ranking=1&ingredients="
	var apiKey = "&mashape-key=3ecf811a02msh7edb1779cb43feap163d3ejsn0447e90a0ef2";
	var queryURL = baseURL + ingredient + apiKey;
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function (response) {
		console.log(response);
		results.push(response);
		var i;
		for (i = 0; i < response.length; i++) {
			var result = $("<div>");
			var listTitle = response[i].title;
			var title = $("<p>").text(listTitle);
			console.log(listTitle);
			var id = response[i].id;
			console.log(id);
			result.attr("id", ""+i+"");
			result.attr("recipeID", ""+id+"");
			result.attr("class", "recipe");
			var imgUrl = response[i].image;
			console.log(imgUrl);

			var listImg = $("<img>");
			listImg.attr("src", imgUrl);

			$(".recipes").append(result);
			$("#" + i).append(listImg);
			$("#" + i).append(title);
		};
	});
});


// clicking on recipe list div extracts calorie count for chosen recipe and feeds it into
// nutritionix API to pull exercise equivalent data

$(document).on("click", ".recipe", function() {
	console.log(this);
	var recipeID = $(this).attr("recipeid");
	var recipeURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/"+ recipeID +"/summary??";
	var ingredientURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/"+ recipeID +"/information??";
	//var recipeURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/"+ recipeID +"/information?amount=0&unit=gram??";
	var apiKey = "&mashape-key=5b49b5076dmsh8b19b82d3d1e352p188cb3jsn37c3b8570750";
	// var widgitURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + recipeID + "/nutritionWidget"
	var summaryURL = recipeURL + apiKey;
	var ingredientQuery = ingredientURL + apiKey;
	$.ajax({
		url: ingredientQuery,
		method: "GET"
	}).then(function(response) {
		console.log(response);
		var fullIngredients = response.extendedIngredients;
		for (i = 0; i < fullIngredients.length; i++) {
			var list = fullIngredients[i].originalString;
			fullIngList.push(list);
		};
		ingredientList.push(fullIngList);
		instructions.push(response.instructions);
		recipeImage.push(response.image);
		recipeTitle.push(response.title);
	});
	
	$.ajax({
		url: summaryURL,
		method: "GET"
	}).then(function(response) {
		console.log(response);
		location.href = "recipe.html";
		var finalRecipe = $("<div>");
		var recipeTitle = response.title;
		var title = $("<p>").text(recipeTitle);
		console.log(recipeTitle);
		var summary = JSON.stringify(response.summary);
		console.log(summary);
		details.push(summary);
		finalRecipe.attr("class", "finalresult");
		// var imgUrl = response[i].image;
		// console.log(imgUrl);
		// var listImg = $("<img>");
		// listImg.attr("src", imgUrl);
		$(finalRecipe).html(summary);
		$(finalRecipe).prepend(title);
		var strong = finalRecipe.find("b");


		for (i = 0; i < strong.length; i++) { 
			// console.log($(strong[i]).text().indexOf("calorie"));
			if ($(strong[i]).text().indexOf("calorie") > 0) {
				// console.log($(strong[i]).text());
				calories = $(strong[i]).text();
				console.log(calories);
				exercise.push(calories);
			}
		};
	});
});


exercise.orderByKey().limitToLast(1).on("child_added", function (snapshot) {
var calorieCount = snapshot.val();
$.ajax({
	url: "https://trackapi.nutritionix.com/v2/natural/exercise",
	type: "POST",
	data: {
		query: calorieCount + " walk " + calorieCount + " swim " + calorieCount + " biking"
	},
	headers: {
		"x-app-id":"f2e8e6e8",
		"x-app-key":"9f46a0f17850cc26bc5d992644bd3c2d"
	}
}).then(function (response) {
	console.log(response);
	var walking = response.exercises[0].duration_min;
	var swim = response.exercises[1].duration_min;
	var bike = response.exercises[2].duration_min;
	console.log("minutes of walking " + walking);
	console.log("minutes of swiming " + swim);
	console.log("minutes of biking " + bike);
	$("#info").html("<p>Minutes of Walking: " + walking + "</p><p>Minutes of Swimming: " + swim + "</p><p>Minutes of Biking: " + bike + "</p>");
});
});

details.orderByKey().limitToLast(1).on("child_added", function (snapshot) {
	var summary = snapshot.val();
	$("#summary").html(summary);
});

ingredientList.orderByKey().limitToLast(1).on("child_added", function (snapshot) {
	var ingredients = snapshot.val();
	$("#ingredients").html("<p>" + ingredients + "</p>");
});

instructions.orderByKey().limitToLast(1).on("child_added", function (snapshot) {
	var instructions = snapshot.val();
	$("#instructions").html("<p>" + instructions + "</p>");
});

recipeImage.orderByKey().limitToLast(1).on("child_added", function (snapshot) {
	var imageSrc = snapshot.val();
	var image = $("<img>");
	image.attr("src", imageSrc);
	$("#image").html(image);
});

recipeTitle.orderByKey().limitToLast(1).on("child_added", function (snapshot) {
	var title = snapshot.val();
	$("#title").html(title);
});