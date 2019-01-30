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
	var results = database.ref("recipe-results");
	
	
	// Landing page search functions
	$("#clickSearch").on("click", function () {
		var ingredient = $(".search").val().trim();
		console.log(ingredient);
		$(".search").val("");
		// push search term to Firebase database
		searches.push(ingredient);
		// redirect to the list.html page
		location.href = "list.html";
	});
	$(".search").keyup(function () {
		var keyCode = (event.keyCode ? event.keyCode : event.which);
		if (keyCode == 13) {
			var ingredient = $(".search").val().trim();
			console.log(ingredient);
			$(".search").val("");
			searches.push(ingredient);
			location.href = "list.html";
		}
	});
	
	// List page search functions
	$("#listSearch").on("click", function () {
		var ingredient = $(".recipeSearch").val().trim();
		console.log(ingredient);
		$(".search").val("");
		searches.push(ingredient);
		location.href = "list.html";
	});
	
	$(".recipeSearch").keyup(function () {
		var keyCode = (event.keyCode ? event.keyCode : event.which);
		if (keyCode == 13) {
			var ingredient = $(".recipeSearch").val().trim();
			console.log(ingredient);
			$(".search").val("");
			searches.push(ingredient);
			location.href = "list.html";
		}
	});
	
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
	
	
		// var fitURL = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";
		// var fitApiKey = "AIzaSyALb1gwy2yytMD70XFhHvGqxUxMQRvXZHM";
		// var fitQueryURL = "https://www.googleapis.com/fitness/v1/users/me/dataSources";
		// $.ajax({
		// 	url: "https://conversation_username:conversation_password@gateway.watsonplatform.net/conversation/api/v1/workspaces/CONVERSATION_ID/message?version=2016-07-11",
		// 	method: "POST",
		// 	headers: {
		// 	  "Content-Type": "application/json"
		// 	},
		// 	data: {
		// 	  input: {
		// 		text: " "
		// 	  }
		// 	}
		//   })
		//   done(function(data) {
		// 	// handle success response
		//   })
		//   .fail(function(err) {
		// 	// handle error response
		//   });
	
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
				var id = response[i].id;
				console.log(id);
				result.attr("id", ""+i+"");
				result.attr("recipe", ""+id+"");
				result.attr("class", "recipe");
				var imgUrl = response[i].image;
				console.log(imgUrl);
	
				var listImg = $("<img>");
				listImg.attr("src", imgUrl);
	
				$(".recipes").append(result);
				$("#" + i).append(listImg);
				$("#" + i).append(title)
			};
		});
	});
	
	searches.orderByKey().limitToLast(1).on("child_added", function (snapshot) {
		var ingredient = snapshot.val();
	
		console.log("Pulled from Firebase: " + ingredient);
		var baseURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients??number=5&ranking=1&ingredients="
		var apiKey = "&mashape-key=5b49b5076dmsh8b19b82d3d1e352p188cb3jsn37c3b8570750";
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
				result.attr("id", i);
				result.attr("class", "recipeRow")
				var imgUrl = response[i].image;
				console.log(imgUrl);
	
				var listImg = $("<img>");
				listImg.attr("src", imgUrl);
	
				$(".recipes").prepend(result);
				$("#" + i).append(listImg);
				$("#" + i).append(title)
			};
		});
	// search the spoontacular API for recipe summary
	$(document).on("click", ".recipe", function() {
		console.log(this);
		var recipeID = $(this).attr("recipe");
		console.log(recipeID);
		var recipeURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/" + recipeID + "/summary"
		var apiKey = "&mashape-key=5b49b5076dmsh8b19b82d3d1e352p188cb3jsn37c3b8570750";
		var widgitURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + recipeID + "/nutritionWidget"
		var summaryURL = recipeURL + apiKey;
		//location.href = "recipe.html";
		console.log(summaryURL);
		// $.ajax({
		// 	url: summaryURL,
		// 	method: "GET"
		// }).then(function(response) {
		// 	console.log(response);
		// });
		
	
	
	
		// nutritionix.com link https://trackapi.nutritionix.com/v2/search/item?nix_item_id=513fc9e73fe3ffd40300109f
		// instant search https://trackapi.nutritionix.com/v2/search/instant?query=
		// API appID 94e6f4cd & appKey b4dc2ec4af61524c35664ecb7ac47083
		// var calorie = 100;
		// $.ajax({
		// 	url: "https://trackapi.nutritionix.com/v2/search/instant?query="+ calorie +"calorie walk",
		// 	method: "GET";
		// 	headers: {
		// 	'x-app-id': "94e6f4cd";
		// 	'x-app-key': "b4dc2ec4af61524c35664ecb7ac47083";
		// 	}
		//   }).done(function(response) {
		// 	console.log(response);
		//   });
			// $.ajax({
			// 	url: summaryURL,
			// 	method: "GET"
			// }).then(function(response) {
			// 	console.log(response);
			// });
	});
});