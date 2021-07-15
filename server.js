// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Global Constants and Variables
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?';
const byZip = 'zip='; //Searches US by Default
const also = '&';
const inC = 'units=metric';
const inF = 'units=imperial';
const apiKeyQ = 'appid=';

require('dotenv').config(); // Load Environment Variable
const apiKey = process.env.OpenWeatherAPIKey; // Store API Key locally

const express = require('express'); // Include Express
const bodyParser = require('body-parser'); // Include Body-parser
const cors = require('cors'); // Include CORS
const fetch = require('node-fetch'); // Include fetch

const app = express(); // Start up an instance of app
const port = 8080; // Port for the server to listen at

const server = app.listen(port, ()=>{
  console.log(`Running on "localhost:${port}"`);
  console.log(`API Key: ${apiKey}`);
});

let projectData = [];
let lastEntry;

// ----------------------------------------------------------------------------
// Functions
// ----------------------------------------------------------------------------

function configureApp() {
  //Configure App Instance
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());

  // Initialize the Application Project folder
  app.use(express.static('website'));
}

async function processRequest(data) {
  console.log("URL: " + baseURL+byZip+data.zip+also+inF+also+apiKeyQ+apiKey);
  const response = await fetch(baseURL+byZip+data.zip+also+inF+also+apiKeyQ+apiKey);

  try {
    const json = await response.json();
    json.feelings = data.feelings;
    lastEntry = json;
    return json;
  }
  catch(error) {
    console.log("Error: \n", error);
  }
}

function serverMain() {
  // Configure App
  configureApp();

  app.get('/all', (req, res)=>{
    console.log("Returning: ");
    console.log(lastEntry);
    res.send(lastEntry);
  });

  app.post('/entry', async (req, res)=>{
    console.log("Processing: ");
    console.log(req.body);
    reqData = await processRequest(req.body)
    projectData.push(reqData);
    res.send({msg: 'POST received'});
  });

}

serverMain();
