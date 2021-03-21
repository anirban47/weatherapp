require("dotenv").config();
const express = require("express");
const axios = require("axios");
const ejs = require("ejs");
const app = express();
// const https = require('https');
// const { response } = require('express');

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.render("index.ejs");
});

app.post("/", (req, res) => {
    const query = req.body.query;
    const API_KEY = process.env.API_KEY;

    const geocodingAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`;

    axios
        .get(geocodingAPI)
        .then((response) => {
            // console.log(response);
            return {
                lat: response.data[0].lat,
                lon: response.data[0].lon,
                name: response.data[0].name,
            };
        })
        .then((locationData) => {
            const weatherAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${locationData.lat}&lon=${locationData.lon}&exclude=minutely&units=metric&appid=${API_KEY}`;
            axios.get(weatherAPI).then((response) => {
                console.log(response);
                const weatherData = response.data;
                const icon = weatherData.current.weather[0].icon;
                const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`
                const date = weatherData.current.dt;
                res.render("weatherReport.ejs", {
                    locationName: locationData.name,
                    iconURL: iconURL,
                    date: (new Date(weatherData.current.dt)).toLocaleDateString(),
                    temp: weatherData.current.temp,
                });
            });
        });
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
