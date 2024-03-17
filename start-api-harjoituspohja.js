import "./style.css";
import { fetchData } from "./fetch.js";

async function getUserID() {
  const url = "https://hyte-servuu.northeurope.cloudapp.azure.com/api/auth/me";
  const token = localStorage.getItem("token");

  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Failed to fetch user data. Status: " + response.status);
    }

    const data = await response.json();
    if (!data.user || !data.user.user_id) {
      throw new Error("Invalid response format. User ID not found.");
    }

    return data.user.user_id;
  } catch (error) {
    console.error("Error fetching user ID:", error.message);
    return null; // Return null if an error occurs
  }
}




const allButton = document.querySelector(".get_users");
allButton.addEventListener("click", getEntries);

async function getEntries() {
  console.log("Haetaan kaikki entriet");

  const url = "https://hyte-servuu.northeurope.cloudapp.azure.com/api/entries";
  let tokeni = localStorage.getItem("token");

  const options = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: "Bearer: " + tokeni,
    },
  };
  fetchData(url, options).then((data) => {
    // käsitellään fetchData funktiosta tullut JSON
    console.log(data);
    createTable(data);
    // document.getElementById("name").innerHTML = data.user.username;
  });
}

function createTable(data) {
  const tbody = document.querySelector(".tbody");
  tbody.innerHTML = "";

  data.forEach((rivi) => {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.innerText = formatDate(rivi.entry_date);
    tr.appendChild(td1);

    const td2 = document.createElement("td");
    td2.innerText = rivi.mood;
    tr.appendChild(td2);

    const td3 = document.createElement("td");
    td3.innerText = rivi.sleep_hours;
    tr.appendChild(td3);

    const td4 = document.createElement("td");

    const noteButton = document.createElement("button");
    noteButton.className = "check";
    noteButton.innerText = "Notes";

    noteButton.addEventListener("click", function () {
      const notes = rivi.notes;
      openDialog(notes);
    });

    td4.appendChild(noteButton);
    tr.appendChild(td4);

    const td5 = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.className = "del";
    deleteButton.dataset.id = rivi.entry_id;
    deleteButton.textContent = "Delete";
    td5.appendChild(deleteButton);
    deleteButton.addEventListener("click", deleteUser);

    const td6 = document.createElement("td");
    td6.innerText = rivi.entry_id;

    tr.appendChild(td5);
    tr.appendChild(td6);

    tbody.appendChild(tr);
  });
}

function openDialog(notes) {
  const dialog = document.getElementById("notesDialog");
  const dialogText = document.getElementById("dialogText");
  dialogText.innerText = notes;
  dialog.showModal();
}

// Sulje dialogi
document.getElementById("closeNotes").addEventListener("click", function () {
  document.getElementById("notesDialog").close();
});

function getUser(evt) {
  console.log("klikkasit info nappulaa");
  const id = evt.target.attributes["data-id"].value;
  console.log(id);
}

function deleteUser(evt) {
  console.log("klikkasit delete nappulaa", evt);
  const id = evt.target.attributes["data-id"].value;
  console.log(id);

  const id2 = evt.target.parentElement.nextElementSibling.textContent;
  console.log("toinen tapa", id2);

  const url = "https://hyte-servuu.northeurope.cloudapp.azure.com/api/entries/" + id;
  let tokeni = localStorage.getItem("token");

  const options = {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: "Bearer: " + tokeni,
    },
  };

  const answer = confirm("Oletko varma, että haluat poistaa entryn:" + id);
  if (answer) {
    fetchData(url, options).then((data) => {
      // käsitellään fetchData funktiosta tullut JSON
      console.log(data);
      getEntries();
    });
  }
}

const createDiary = document.querySelector(".creatediary");

createDiary.addEventListener("click", async (evt) => {
  evt.preventDefault();
  console.log("Nyt luodaan Diary entry");

  // # Create user
  // POST http://127.0.0.1:3000/api/users
  // content-type: application/json

  const form = document.querySelector(".addform");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const entryDate = form.querySelector("input[name=entry_date]").value;
  const mood = form.querySelector("select[name=mood]").value;
  const weight = form.querySelector("input[name=weight]").value;
  const sleepHours = form.querySelector("input[name=sleep_hours]").value;
  const notes = form.querySelector("textarea[name=notes]").value;
  const userId = await getUserID();
  console.log(userId);

  // Format the date to EU format (dd.mm.yyyy)
  const formattedDate = formatDate(entryDate);

  const url = "https://hyte-servuu.northeurope.cloudapp.azure.com/api/entries";
  let tokeni = localStorage.getItem("token");

  const body = {
    user_id: userId,
    entry_date: entryDate,
    mood: mood,
    weight: weight,
    sleep_hours: sleepHours,
    notes: notes,
  };

  console.log(body);

  const options = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: "Bearer: " + tokeni,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body), // body data type must match "Content-Type" header
  };

  fetchData(url, options)
    .then((data) => {
      console.log(data);
      // reset form fields after successful submission
      getEntries();
      form.reset();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// Function to format date to EU format (dd.mm.yyyy)
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

async function showUserName() {
  console.log("Täällä ollaan!");
  const url = "https://hyte-servuu.northeurope.cloudapp.azure.com/api/auth/me";
  let tokeni = localStorage.getItem("token");

  const options = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: "Bearer: " + tokeni,
    },
  };
  fetchData(url, options).then((data) => {
    // käsitellään fetchData funktiosta tullut JSON
    console.log(data);
    document.getElementById("name").innerHTML = data.user.username;
  });
}

document.querySelector(".logout").addEventListener("click", logOut);

function logOut(evt) {
  evt.preventDefault();
  localStorage.removeItem("token");
  console.log("logginout");
  window.location.href = "index.html";
}

showUserName();
