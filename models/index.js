"use strict";

// Dependencies
var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");

// Load database configuration and initialize the ORM
var config    = require("config").get("database");
var sequelize = new Sequelize(config.get("database"), config.get("user"), config.get("password"), config.get("options"));
var db        = {};

// Check if connection is successful
sequelize
    .authenticate()
    .then(function(err) {
        console.log('Connection has been established successfully.');
    }, function (err) {
        console.log('Unable to connect to the database:', err);
    });


// Import models
fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;
    });

// Model-to-model associations
Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;