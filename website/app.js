// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Global Constants and Variables
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const zipCode = document.getElementById("zip");
const userFeelings = document.getElementById("feelings");
const submitButton = document.getElementById("generate");
const date = document.getElementById("date");
const temp = document.getElementById("temp");
const content = document.getElementById("content");
const userInput = document.querySelector(".ui");
const journalEntry = document.querySelector(".wj-entry");
const newEntryButton = document.getElementById("new-entry");

let displayData = [];

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

function displayDate() {
  if (displayData.cod == 200) {
    date.getElementsByTagName('h3')[0].textContent = (new Date(displayData.dt)).toGMTString();
    date.getElementsByTagName('p')[0].textContent = `${displayData.name}, ${displayData.zip}`;
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
      displayDate();
    });
}

submitButton.addEventListener("click", ()=>{
  executePostRequest();
  userInput.style.display = 'none';
  journalEntry.style.display = 'inline';
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
