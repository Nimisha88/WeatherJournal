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

const tempUnitHTML = '<sup><a id="inF" class="active-temp" href="#">°F</a>|<a id="inC" class="inactive-temp" href="#">°C</a></sup>';

let displayData = [];
let unitF;
let unitC;
let iconHTML;


// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Functions
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// HTTP Get/Post request to Server
// ----------------------------------------------------------------------------
// postAsync(url = '', data = {}) - Post new Journal entry
// getAsync(url = '') - Get dynamic data of Last Journal entry
// ----------------------------------------------------------------------------

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


// ----------------------------------------------------------------------------
// Process new User Journal Entry
// ----------------------------------------------------------------------------
// UserEntry(zip, feelings) - Journal Entry object with user input data
// executePostRequest() - Post new User Journal Entry and display dynamic data
// ----------------------------------------------------------------------------

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
      // console.log(displayData);
      if (displayData.cod != 200) {
        zipCode.value = '';
        userFeelings.value = '';
        console.log(`Error: ${JSON.stringify(displayData)}`);
        alert(`Something went wrong. Please verify Zip Code and try again.`);
      } else {
        userInput.style.display = 'none';
        journalEntry.style.display = 'block';
        displayWeatherIcon();
        displayTemp();
        displaySunTimes();
        displayDate();
        displayUserFeelings();
      }
    });
}


// ----------------------------------------------------------------------------
// Add Event Listeners on "Log Journal Entry" and "New Entry?" buttons
// ----------------------------------------------------------------------------

submitButton.addEventListener("click", () => {
  if ((zipCode.value == "") || (userFeelings.value.trim() == "")) {
    alert("Both inputs are required to log the Journal Entry. Please try again!");
  } else {
    executePostRequest();
  }
});

newEntryButton.addEventListener("click", () => {
  journalEntry.style.display = 'none';
  userInput.style.display = 'block';
  zipCode.value = '';
  userFeelings.value = '';
});


// ----------------------------------------------------------------------------
// displayWeatherIcon() - Function to identify and display Weather Icon
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
// ----------------------------------------------------------------------------
// toggleTempUnitClassesOnClick() - Toggles betwen F and C as active
// addTempUnitChangeListener() - Add Event Listener to F and C links
// displayTemp() - Display Temp, FeelsLike, Humidity and Wind data
// ----------------------------------------------------------------------------
// Temp displays in F or C, Wind in mph or kph (imperial/metric) respectively
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
    apiOtherData[0].textContent = `${Math.round(displayData.tempInC['feels_like'])}°`;
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
// displaySunTimes() - Function to display Sun rise/set
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
// LocalDateAndTime(day, dt, time, tzone) - Local Date/Time object
// getDateObject(isodt) - get Local Date object
// displayDate() - Displays Date and Location
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
// displayUserFeelings() - Function to display feelings entered by user
// It highlights the common emotional words that expresses user's feelings
// ----------------------------------------------------------------------------

function displayUserFeelings() {
  if (displayData.cod == 200) {
    let feelingsHTML = displayData.feelings.replace(/well|fine|great|good|like|nice|happy|love|excited|surprised|satisfied|fortunate|thankful|energetic|content|peaceful|hopeful|joyous|proud|optimistic|glad|pleased|elated|thrilled|amused|sick|sad|despise|lonely|anxious|bad|angry|hate|gloomy|depressing|irritated|cheated|offended|disturbed|annoyed|worried|nervous|stressed|lost|troubled|miserable|hopeless|disappointed|heartbroken|frustrated|betrayed|upset|embarrassed|furious|tired|curious|warm|hot|cold|uncomfortable|confused|bound|relieved|relaxed|free|aware|sympathetic|comfortable|free|peaceful|refreshed|determined|motivated|grateful|confident|inspired/gi, function (emoWord) {
      console.log("InEmoWordFn");
      return `<span class="emo-word">${emoWord}</span>`;
    });
    console.log("After: " + feelingsHTML);
    content.getElementsByTagName('p')[0].innerHTML = feelingsHTML;
  }
}
