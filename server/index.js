var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/../react-client/dist'));
app.use(express.static(__dirname + '/../react-client/src'))


app.post('/entry', function(req, res) {
ingreds = req.body.toString()


//setting up params for request to Spoonacular API
var recipeRetrievalOptions = {
  url : 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?',
  method: 'GET',
  headers: {
    'X-Mashape-Key': 'h88XRdVMrZmshoBOiBWVrmfnfWKTp1SlnIjjsn4adRtjrPpen1',
    'Accept': 'application/json'
 },
  qs: {
    ingredients: ingreds,
    number: 10
  }
}

//preparing obj to ultimately send back to client

//sending request to Spoonacular
var finalResponseObj = {}
var summary = {}

request(recipeRetrievalOptions, function(error, response, body) {
  response = JSON.parse(response.body);

  for (var i = 0; i < response.length; i++) {
    var newResponse = response[i]

    //setting up object that will be stored inside of finalResponse for each recipe
    var responseObj = {}
    responseObj["id"] = newResponse.id
    responseObj["title"] = newResponse.title
    responseObj["image"] = newResponse.image
    responseObj["usedIngredientCount"] = newResponse.usedIngredientCount
    responseObj["missedIngredientCount"] = newResponse.missedIngredientCount
    finalResponseObj[i] = responseObj

  }
  res.send(finalResponseObj)
 })
})



app.listen(process.env.PORT || 3000 , function() {
  console.log(`istening on port ${process.evn.PORT}`)
})
