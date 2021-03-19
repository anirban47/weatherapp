require('dotenv').config()
const express = require('express');
const axios = require('axios');
const ejs = require('ejs');
const app = express();
// const https = require('https');
// const { response } = require('express');

app.use(express.urlencoded({extended: true})); 
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render("index.ejs");
});

app.post("/", (req,res) => {
    const query = req.body.query;
    const API_KEY = process.env.API_KEY;
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}`;
    axios.get(url)
      .then((response) => {
          console.log("success");
      })
      .catch((error) => {
         console.log(error);
         res.render("error.ejs");
      })
})

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
