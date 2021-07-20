// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Global Constants and Variables
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const zipCode = document.getElementById("zip");
const userFeelings = document.getElementById("feelings");
const submitButton = document.getElementById("generate");
const date = document.getElementById("date");
const temp = document.getElementById("temp").getElementsByTagName('span')[0];
const content = document.getElementById("content");
const userInput = document.querySelector(".ui");
const journalEntry = document.querySelector(".wj-entry");
const newEntryButton = document.getElementById("new-entry");
const weatherIcon = document.getElementById("wi");
const apiOtherData = document.querySelectorAll(".api-other-desc");
const sunTimesData = document.querySelectorAll(".sun-desc");

// const feelsLike = document.querySelector(".feels-like");
// const humidity = document.querySelector(".humidity");
// const wind = document.querySelector(".wind");


const tempUnitHTML = '<sup><a id="inF" class="active-temp" href="#">°F</a>|<a id="inC" class="inactive-temp" href="#">°C</a></sup>';

let displayData = [];
let unitF;
let unitC;
let iconHTML;

async function postAsync(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  try {
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function getAsync(url = '') {
  const response = await fetch(url);

  try {
    const json = await response.json();
    console.log(json);
    displayData = json;
  } catch (error) {
    console.log("Error: ", error);
  }
}

function UserEntry(zip, feelings) {
  this.zip = zip;
  this.feelings = feelings;
}









async function executePostRequest() {
  let data;
  postAsync('/entry', new UserEntry(zipCode.value, userFeelings.value))
    .then((json) => {
      return getAsync('/all');
    })
    .then((json) => {
      console.log(displayData);
      displayWeatherIcon();
      displayTemp();
      displaySunTimes();
      displayDate();
      displayUserFeelings();
    });
}

submitButton.addEventListener("click", () => {
  executePostRequest();
  userInput.style.display = 'none';
  journalEntry.style.display = 'block';
});

newEntryButton.addEventListener("click", () => {
  journalEntry.style.display = 'none';
  userInput.style.display = 'block';
  zipCode.value = '';
  userFeelings.value = '';
});

// ----------------------------------------------------------------------------
// Function to display Weather Icon
// ----------------------------------------------------------------------------

function displayWeatherIcon() {

  if (displayData.cod == 200) {

    // Identify which Icon to display
    switch (Math.floor(displayData.weather[0].id / 100)) {

      case 2:
        iconHTML = '<i class="fas fa-poo-storm fa-3x"></i>';
        break;

      case 3:
        iconHTML = '<i class="fas fa-cloud-rain fa-3x"></i>';
        break;

      case 5:

        switch (displayData.weather[0].id) {
          case 511:
            iconHTML = '<i class="far fa-snowflake fa-3x"></i>';
            break;
          case 520:
          case 521:
          case 522:
          case 531:
            iconHTML = '<i class="fas fa-cloud-showers-heavy fa-3x"></i>';
            break;
          default:
            // Includes cases: 500 - 504
            iconHTML = '<i class="fas fa-cloud-sun-rain fa-3x"></i>';
            break;
        }
        break;

      case 6:
        iconHTML = '<i class="far fa-snowflake fa-3x"></i>';
        break;

      case 7:
        iconHTML = '<i class="fas fa-smog fa-3x"></i>';
        break;

      case 8:
        switch (displayData.weather[0].id) {
          case 801:
            iconHTML = '<i class="fas fa-cloud-sun fa-3x"></i>';
            break;
          case 802:
          case 803:
          case 804:
            iconHTML = '<i class="fas fa-cloud fa-3x"></i>';
            break;
          default:
            // Includes case: 800
            iconHTML = '<i class="fas fa-sun fa-3x"></i>';
            break;
        }
        break;

      default:
        // Show barometer if nothing matches!
        iconHTML = '<i class="fas fa-temperature-high fa-3x"></i>';
        break;
    }

    // Display logic
    weatherIcon.innerHTML = iconHTML;
  }
}

// ----------------------------------------------------------------------------
// Function to display Weather details
// Temp in F and C, Wind in mph and kph (imperial/metric)
// ----------------------------------------------------------------------------

function toggleTempUnitClassesOnClick() {
  unitF.classList.toggle('active-temp');
  unitF.classList.toggle('inactive-temp');
  unitC.classList.toggle('active-temp');
  unitC.classList.toggle('inactive-temp');
}

function addTempUnitChangeListener() {
  unitF.addEventListener('click', () => {
    temp.childNodes[0].textContent = Math.round(displayData.main.temp);
    apiOtherData[0].textContent = `${Math.round(displayData.main['feels_like'])}°`;
    apiOtherData[2].textContent = `${Math.round(displayData.wind.speed)} mph`;
    toggleTempUnitClassesOnClick();

  });
  unitC.addEventListener('click', () => {
    temp.childNodes[0].textContent = Math.round(displayData.tempInC.temp);
    apiOtherData[0].textContent = `${Math.round(displayData.main['feels_like'])}°`;
    apiOtherData[2].textContent = `${Math.round(displayData.wind.speed * 1.61)} kph`;
    toggleTempUnitClassesOnClick();
  });
}

function displayTemp() {
  if (displayData.cod == 200) {

    temp.innerHTML = `${Math.round(displayData.main.temp)}${tempUnitHTML}`;
    apiOtherData[0].textContent = `${Math.round(displayData.main['feels_like'])}°`;
    apiOtherData[1].textContent = `${displayData.main.humidity}%`;
    apiOtherData[2].textContent = `${Math.round(displayData.wind.speed)} mph`;;


    unitF = document.getElementById("inF");;
    unitC = document.getElementById("inC");;

    addTempUnitChangeListener();
  }
}

// ----------------------------------------------------------------------------
// Function to display Sun times
// ----------------------------------------------------------------------------

function displaySunTimes() {
  if (displayData.cod == 200) {
    sunTimesData[0].textContent = (new Date(displayData.sys.sunrise * 1000)).toString().slice(16, 21);
    sunTimesData[1].textContent = (new Date(displayData.sys.sunset * 1000)).toString().slice(16, 21);
  }
}

// ----------------------------------------------------------------------------
// Function to display Date
// ----------------------------------------------------------------------------

function LocalDateAndTime(day, dt, time, tzone) {
  this.day = day;
  this.dt = dt;
  this.time = time;
  this.tzone = tzone;
}

function getDateObject(isodt) {
  const dateArray = (new Date(displayData.dt * 1000)).toString().split(" ");
  return new LocalDateAndTime(dateArray[0], `${dateArray[1]} ${dateArray[2]} ${dateArray[3]}`, dateArray[4], `${dateArray[5]} ${dateArray[6]}`);
}

function displayDate() {
  if (displayData.cod == 200) {
    let dateObject = getDateObject(displayData.dt);
    date.getElementsByTagName('h3')[0].textContent = `${dateObject.day}, ${dateObject.dt}, ${dateObject.time}`;
    date.getElementsByTagName('p')[0].textContent = `${displayData.name}, ${displayData.zip}`;
  }
}

// ----------------------------------------------------------------------------
// Function to display User's Feelings
// ----------------------------------------------------------------------------

function displayUserFeelings() {
  if (displayData.cod == 200) {
    content.getElementsByTagName('p')[0].textContent = displayData.feelings;
  }
}
