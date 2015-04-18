#!/usr/bin/env node

/*
	API response generator for FlightTest
	As a back-end system is not defined for this system, this tool looks through api/cities.json and generates the correct response files 
 */

/* global __dirname */

var fs = require("fs"), path = require("path"), mkdirp = require("mkdirp"), rimraf = require("rimraf");
var API_DIR = path.resolve(__dirname, "..", "api/") + "/";

// Attempt to read cities.json
var cities = fs.readFileSync(API_DIR + "cities.json", "utf-8");
cities = JSON.parse(cities);

// Sort by ID
cities.sort(function(a, b) {
	return a.id - b.id;
});

// Empty out existing directories
rimraf.sync(API_DIR + "search/");

// Iterate over cities
cities.forEach(function(cityA) {
	cities.forEach(function(cityB) {
		if(cityB.id == cityA.id) {
			return;
		}

		// Between 1 and 10 hours
		var baseDuration = 3600000 * (1 + Math.floor(Math.random()*10));
		var baseCost = 400 + 46.45 * (baseDuration/36000000);

		var outputFile = API_DIR + "search/" + cityA.id + "/" + cityB.id + ".json";
		mkdirp.sync(path.dirname(outputFile));

		// Create 3-6 random flights
		var count = 3 + Math.floor(Math.random()*4);
		var flights = [];
		for(var i = 0; i < count; i++) {
			// Create a random time in 15 minute segments
			var time = 3600000 * Math.floor(Math.random()*24) + (900000 * Math.floor(Math.random()*4));
			// Number of changes
			var changes = Math.floor(Math.random()*3);
			// Duration is a random base value multiplied by the number of stops
			var duration = baseDuration * (1+(changes / 4));

			// Cost is decreased by an increase in changes
			var cost = baseCost * (1 - (changes/6));

			flights.push({
				"time" : time,
				"duration" : duration,
				"changes" :  changes,
				"cost" : cost
			});
		}

		fs.writeFileSync(outputFile, JSON.stringify(flights, null, 4));

	});

	console.log("Wrote flights from ID:", cityA.id);
});