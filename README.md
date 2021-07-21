# WeatherJournal
An asynchronous web application that uses [OpenWeatherMap](https://openweathermap.org/) API data to display current weather of a given location along with the user input of how the user is feeling presently.


## Software, Firmware and Hardware

* HTML 5
* CSS 3
* JavaScript ES6
* NodeJS v14.17.3 and latest version of following packages:
  * Express
  * Body-Parser
  * Cors
  * Node-Fetch
  * Dotenv


## Installation instructions

* Install [NodeJS](https://nodejs.org/)
* Install NodeJS packages using following command lines:
```npm install express
npm install body-parser
npm install cors
install node-fetch
npm install dotenv
```
* Download the application locally
  * Obtain an APIKey at [OpenWeather](https://openweathermap.org/) by creating a free account.
  * In the main application folder (containing server.js), create `.env` file and add your APIKey like `OpenWeatherAPIKey=your-api-key-here`
  * On terminal, `cd` to the project folder containing `server.js` and initiate the local server by
  `node server.js`
* On a web browser, initiate the application using url http://localhost:8080/


## Folder Structure

* main
  * README.md - Read me file
  * server.js - Server side scripting
  * website - Folder containing files used for client side scripting/rendering
    * css - Folder containing all styling scripts used in the application
    * image - Folder containing all images used in the application
    * app.js - Client side scripting
    * index.html - Landing page of the application


## Application Preview

https://user-images.githubusercontent.com/29170466/126427766-3c917d62-a844-4e9d-9028-31312212eb0d.mov


## Highlights

* Identifies and display apt weather icon from a different source.
* Switches between Imperial/Metric system (F to C | mph to kph).
* Highlights words that expresses user's feelings in the journal entry.


## Copyright

The application is designed and developed by **Nimisha Viraj** as a part of [Udacity Front End Web Developer Nanodegree] (https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011).


## Acknowledgements

* [Udacity](https://udacity.com) - Source of application requirements
* [OpenWeatherMap](https://openweathermap.org/) - Source of Weather Data
* [Color Hunt](https://colorhunt.co/) - Source of Color Palette
* [Stackoverflow](https://stackoverflow.com/) - Source of resolutions to coding errors and roadblocks
* [Font Awesome](https://fontawesome.com/) - Source of Icons

## Limitation and Scope

* Words being highlighted as emo-words are limited to a few frequently used words used to express oneself.
* Application is limited to US Zip codes only, can expand to cover all zip codes across the globe.
