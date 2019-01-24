// npm install unirest;
// var unirest = require('unirest');




// An example of how the Spoonacular query should look
// unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=5&ranking=1&ingredients=apples%2Cflour%2Csugar")
// .header("X-RapidAPI-Key", "5b49b5076dmsh8b19b82d3d1e352p188cb3jsn37c3b8570750")
// .end(function (result) {
//   console.log(result.status, result.headers, result.body);
// });


var blergh = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=5&ranking=1&ingredients=apples%2Cflour%2Csugar";

function callAPI() {
    
	var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients??number=5&ranking=1&ingredients=apples%2Cflour%2Csugar&mashape-key=5b49b5076dmsh8b19b82d3d1e352p188cb3jsn37c3b8570750";
	// var afterIngredients = '&number=200&limitLicense=false&fillIngredients=true&ranking=1&limitLicense=false&mashape-key=btSAgzlS6CmshxyNyEh24vDF8sl2p1w43h9jsnCABHsQZSfxx6'

	//Get recipes for specific ingredients from API 
	var searchByIngredients = new XMLHttpRequest();
	searchByIngredients.open("GET", queryURL, false);
	searchByIngredients.send();

	//Parse what API returns (in JSON)
    var recipes = JSON.parse(searchByIngredients.response);
    
    console.log(recipes);




    // $.ajax({
    //     url: queryURL,
    //     method: "GET"
    // }).then(function(response) {
    //         console.log(response)});
};

callAPI();

// HttpResponse<JsonNode> response = Unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=5&ranking=1&ingredients=chicken")
// .header("X-RapidAPI-Key", "5b49b5076dmsh8b19b82d3d1e352p188cb3jsn37c3b8570750")
// .asJson();