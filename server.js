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

const server = app.listen(port, () => {
  console.log(`Running on "localhost:${port}"`);
});

let projectData = [];
let lastEntry;


// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Functions
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Configue App instance
// ----------------------------------------------------------------------------
// configureApp() - Initialise app to use body-parser and cors
// ----------------------------------------------------------------------------

function configureApp() {
  //Configure App Instance
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(cors());

  // Initialize the Application Project folder
  app.use(express.static('website'));

}


// ----------------------------------------------------------------------------
// Process Client Request recieved
// ----------------------------------------------------------------------------
// calculateF2C(tempInF) - Take temp in F and returns temp in C
// getTempDataInC(tempDataInF) - Take all temps in F and Return all temps in C
// processRequest(data) - Make an API call based on Request data
// ----------------------------------------------------------------------------

function calculateF2C(tempInF) {
  return Math.round((tempInF - 32) * 5/9);
}

function getTempDataInC(tempDataInF) {
    let tempDataInC = {};

    tempDataInC.temp = calculateF2C(tempDataInF.temp);
    tempDataInC.feels_like = calculateF2C(tempDataInF.feels_like);
    tempDataInC.temp_min = calculateF2C(tempDataInF.temp_min);
    tempDataInC.temp_max = calculateF2C(tempDataInF.temp_max);

    return tempDataInC
}

async function processRequest(data) {
  const response = await fetch(baseURL + byZip + data.zip + also + inF + also + apiKeyQ + apiKey);

  try {
    const json = await response.json();
    json.zip = data.zip;
    json.feelings = data.feelings;

    if(json.cod == 200) {
      json.tempInC = getTempDataInC(json.main);
    }

    lastEntry = json;
    return json;
  } catch (error) {
    console.log("Error: \n", error);
  }
}


// ----------------------------------------------------------------------------
// Configure Server instance
// ----------------------------------------------------------------------------
// serverMain() - Configures all HTTP request Get/Post
// ----------------------------------------------------------------------------

function serverMain() {
  // Configure App Instance
  configureApp();

  app.get('/all', (req, res) => {
    console.log("Sending last journal entry");
    res.send(lastEntry);
  });

  app.post('/entry', async (req, res) => {
    console.log("Processing the Journal entry received.");
    // console.log(req.body);
    reqData = await processRequest(req.body)

    // Log the Journal Entry only when Zipcode is valid
    if(reqData.cod != 200) {
      console.log("Something went wrong, discarding this Journal entry!");
      console.log("Error: \n" + JSON.stringify(reqData));
      console.log(`Number of successful Journal entries made so far in this server session: ${projectData.length}`);
    } else {
      projectData.push(reqData);
      console.log(`Saved new Journal entry successfully for this server session.`);
    }

    res.send({
      msg: 'POST received'
    });
  });

}

serverMain();
