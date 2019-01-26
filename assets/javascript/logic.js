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
		// console.log(response.id)
	});
});


// function callAPI() {    
// 	var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients??number=5&ranking=1&ingredients=apples%2Cflour%2Csugar&mashape-key=5b49b5076dmsh8b19b82d3d1e352p188cb3jsn37c3b8570750";
// 	// var afterIngredients = '&number=200&limitLicense=false&fillIngredients=true&ranking=1&limitLicense=false&mashape-key=btSAgzlS6CmshxyNyEh24vDF8sl2p1w43h9jsnCABHsQZSfxx6'

// 	//Get recipes for specific ingredients from API 
// 	var searchByIngredients = new XMLHttpRequest();
// 	searchByIngredients.open("GET", queryURL, false);
// 	searchByIngredients.send();

// 	//Parse what API returns (in JSON)
//     var recipes = JSON.parse(searchByIngredients.response);
    
//     console.log(recipes);
// };