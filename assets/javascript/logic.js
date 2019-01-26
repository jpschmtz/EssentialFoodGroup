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

// Create variables that refer to the firebase database and the recipe-searches branch
var database = firebase.database();
var searches = database.ref("/recipe-searches");
var results = database.ref("recipe-results");

// on click function to capture what user searches for
// is there a way for users to search using "Enter" key?
$("#clickSearch").on("click", function(){
	var ingredient = $(".search").val().trim();
	console.log(ingredient);
	$(".search").val("");
	// push search term to Firebase database
	searches.push(ingredient);
	// redirect to the list.html page
	location.href = "list.html";
});

// replicated the landing page search function

$("#listSearch").on("click", function(){
	var ingredient = $(".listSearch").val().trim();
	console.log(ingredient);
	$(".search").val("");
	// push search term to Firebase database
	searches.push(ingredient);
	// redirect to the list.html page
	location.href = "list.html";
});

searches.orderByKey().limitToLast(1).on("child_added", function(snapshot) {
	var ingredient = snapshot.val();
	
	console.log("Pulled from Firebase: " + ingredient);
	var baseURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients??number=5&ranking=1&ingredients="
	var apiKey = "&mashape-key=5b49b5076dmsh8b19b82d3d1e352p188cb3jsn37c3b8570750";
	var queryURL = baseURL + ingredient + apiKey;
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response) {
		console.log(response);
		results.push(response);
		var i;
		for (i=0; i < response.length; i++) {
			var result = $("<div>");
			var listTitle = response[i].title;
			var title = $("<p>").text(listTitle);
			console.log(listTitle);
			result.attr("id", i);
			var imgUrl = response[i].image;
			console.log(imgUrl);

			var listImg = $("<img>");
			listImg.attr("src", imgUrl);

			$(".recipes").prepend(result);
			$("#" + i).append(listImg);
			$("#" + i).append(title)
		};
	});
});