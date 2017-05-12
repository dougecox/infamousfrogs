var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var Sequelize = require('sequelize');
var flash = require('express-flash');

var databaseUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/test';
var sequelize = new Sequelize(databaseUrl);

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection is successful');
  })
  .catch(function(err) {
    console.log('Unable to connect to database');
  });

var User = sequelize.define('users', {
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
});

var Recipe = sequelize.define('recipes', {
  id: {
    type: Sequelize.INTEGER
  },
  username: {
    type: Sequelize.STRING
  },
  usernameRecipeId: {
    type: Sequelize.STRING, primaryKey: true
  },
  title: {
    type: Sequelize.STRING
  },
  image: {
    type: Sequelize.STRING
  },
  usedIngredientCount: {
    type: Sequelize.INTEGER
  },
  missedIngredientCount: {
    type: Sequelize.INTEGER
  }
});

sequelize.sync();

var createRecipe = (req, res) => {
  Recipe.create({
    id: req.body.recipeId,
    username: req.body.username,
    usernameRecipeId: req.body.username + req.body.recipeId,
    title: req.body.title,
    image: req.body.image,
    usedIngredientCount: req.body.usedIngredientCount,
    missedIngredientCount: req.body.missedIngredientCount
  });

  res.send();
};

var removeRecipe = (req, res) => {
  Recipe.destroy({
    where: {
      username: req.body.username,
      id: req.body.recipeId
    }
  });

  res.send();
};

var retrieveFavorites = (req, res) => {
  Recipe.findAll({where: {username: req.body.username}})
    .then(function(recipes) {
      console.log(recipes)
      res.send(recipes);
    });
};

var createUser = (req, res) => {
  User.findOne({where: {username: req.body.user}}).then(function(user) {
    if (!user) {
      User.create({
        username: req.body.user,
        password: req.body.password
      }).then(function() {
        User.findOne({where: {username: req.body.user}}).then(function(user) {
          res.send(user);
        });
      });
    } else {
      res.send({'useralreadyexists': 'useralreadyexists'});
      // res.render('./views/login.html', {error: 'Username doesnt exist'})
    }
  });
};

var checkIfUserExists = (req, res) => {
  User.findOne({where: {username: req.body.user}}).then(function(user) {
    if (!user) {
      res.send({'userdoesnotexist': 'userdoesnotexist'});
    } else {
      if (req.body.password === user.password) {
        res.send(user);
      } else {
        res.send({'incorrectpassword': 'incorrectpassword'});
      }
    }
  });
};


module.exports.checkIfUserExists = checkIfUserExists;
module.exports.createUser = createUser;
module.exports.createRecipe = createRecipe;
module.exports.removeRecipe = removeRecipe;
module.exports.retrieveFavorites = retrieveFavorites;
