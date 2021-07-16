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
const apiOtherData = document.querySelectorAll(".api-other-desc");
const sunTimesData = document.querySelectorAll(".sun-desc");
// const feelsLike = document.querySelector(".feels-like");
// const humidity = document.querySelector(".humidity");
// const wind = document.querySelector(".wind");


const tempUnitHTML = '<sup><a id="inF" class="active-temp" href="#">°F</a>|<a id="inC" class="inactive-temp" href="#">°C</a></sup>';

let displayData = [];
let unitF;
let unitC;

async function postAsync(url='', data={}) {
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
  }
  catch(error) {
    console.log("Error: ", error);
  }
}

async function getAsync(url='') {
  const response = await fetch(url);

  try {
    const json = await response.json();
    console.log(json);
    displayData = json;
  }
  catch(error) {
    console.log("Error: ", error);
  }
}

function UserEntry(zip, feelings) {
  this.zip = zip;
  this.feelings = feelings;
}

function toggleTempUnitClassesOnClick() {
  unitF.classList.toggle('active-temp');
  unitF.classList.toggle('inactive-temp');
  unitC.classList.toggle('active-temp');
  unitC.classList.toggle('inactive-temp');
}

function addTempUnitChangeListener() {
  unitF.addEventListener('click', () => {
    temp.childNodes[0].textContent = Math.round(displayData.main.temp);
    apiOtherData[0].textContent = Math.round(displayData.main['feels_like']);
    apiOtherData[2].textContent = `${Math.round(displayData.wind.speed)} mph`;
    toggleTempUnitClassesOnClick();

  });
  unitC.addEventListener('click', () => {
    temp.childNodes[0].textContent = Math.round(displayData.tempInC.temp);
    apiOtherData[0].textContent = Math.round(displayData.tempInC['feels_like']);
    apiOtherData[2].textContent = `${Math.round(displayData.wind.speed * 1.61)} kph`;
    toggleTempUnitClassesOnClick();
  });
}

function displayTemp() {
  if (displayData.cod == 200) {

    temp.innerHTML = `${Math.round(displayData.main.temp)}${tempUnitHTML}`;
    apiOtherData[0].textContent = Math.round(displayData.main['feels_like']);
    apiOtherData[1].textContent = `${displayData.main.humidity}%`;
    apiOtherData[2].textContent = `${Math.round(displayData.wind.speed)} mph`;;


    unitF = document.getElementById("inF");;
    unitC = document.getElementById("inC");;

    addTempUnitChangeListener();
  }
}

function displaySunTimes() {
  if (displayData.cod == 200) {
    sunTimesData[0].textContent = (new Date(displayData.sys.sunrise * 1000)).toString().slice(16, 21);
    sunTimesData[1].textContent = (new Date(displayData.sys.sunset * 1000)).toString().slice(16, 21);
  }
}

function displayDate() {
  if (displayData.cod == 200) {
    date.getElementsByTagName('h3')[0].textContent = `${(new Date(displayData.dt*1000)).toString()}`;
    date.getElementsByTagName('p')[0].textContent = `${displayData.name}, ${displayData.zip}`;
  }
}

function displayUserFeelings() {
  if (displayData.cod == 200) {
    content.getElementsByTagName('p')[0].textContent = displayData.feelings;
  }
}

async function executePostRequest() {
  let data;
  postAsync('/entry', new UserEntry(zipCode.value, userFeelings.value))
    .then((json)=>{
      return getAsync('/all');
    })
    .then((json)=>{
      console.log(displayData);
      displayTemp();
      displaySunTimes();
      displayDate();
      displayUserFeelings();
    });
}

submitButton.addEventListener("click", ()=>{
  executePostRequest();
  userInput.style.display = 'none';
  journalEntry.style.display = 'block';
});

newEntryButton.addEventListener("click", ()=>{
  journalEntry.style.display = 'none';
  userInput.style.display = 'block';
  zipCode.value = '';
  userFeelings.value = '';
});

// ----------------------------------------------------------------------------
// Show Journal Entry Div and hide User Input Div
// ----------------------------------------------------------------------------
