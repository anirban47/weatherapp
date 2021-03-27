require("dotenv").config();
const express = require("express");
const axios = require("axios");
const ejs = require("ejs");
const app = express();

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

    //Handling the OpenWeatherMap API
    axios
        .get(geocodingAPI)
        .then((response) => {
            return {
                lat: response.data[0].lat,
                lon: response.data[0].lon,
                name: response.data[0].name,
            };
        })
        .then((locationData) => {
            const weatherAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${locationData.lat}&lon=${locationData.lon}&exclude=minutely&units=metric&appid=${API_KEY}`;
            axios.get(weatherAPI).then((response) => {
                const weatherData = response.data;
                const currentWeatherData = weatherData.current.weather[0];
                const iconURL = `http://openweathermap.org/img/wn/${currentWeatherData.icon}@2x.png`
                var labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                labels = labels.concat(labels.splice(0, new Date().getDay()));
                var tempData = [];
                weatherData.daily.forEach((day, index) => {
                    if(index < 7) {
                        tempData.push(Math.round((day.temp.max + day.temp.min)/2));
                    }
                })
                res.render("weatherReport.ejs", {
                    locationName: locationData.name,
                    iconURL: iconURL,
                    date: (new Date()).toLocaleDateString(),
                    temp: weatherData.current.temp,
                    labels: labels,
                    tempData: tempData,
                });
            });
        });
});

app.listen(process.env.PORT || 8000, () => {
    console.log("Server is running on port 8000");
});
