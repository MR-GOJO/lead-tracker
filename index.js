let myLeads = [];
const inputBtn = document.getElementById("input-btn");
const inputEl = document.getElementById("input-el");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");

let leadStored = JSON.parse(localStorage.getItem("myLeads"));

if (leadStored) {
  myLeads = leadStored;
  render(myLeads);
}

inputBtn.addEventListener("click", function () {
  myLeads.push({ original: inputEl.value, edited: inputEl.value });
  inputEl.value = "";
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
});

// Updated "Edit" button event listener
const editButtons = document.querySelectorAll(".edit-btn");
editButtons.forEach((button) => {
  button.addEventListener("click", function (event) {
    event.stopPropagation();
    const index = button.getAttribute("data-index");
    const currentURL = myLeads[index].original;
    const newText = prompt("Edit the display text:", myLeads[index].edited);

    if (newText !== null) {
      myLeads[index].edited = newText;
      localStorage.setItem("myLeads", JSON.stringify(myLeads));
      render(myLeads);
    }
  });
});

// Updated render function
function render(leads) {
  let textInput = "";
  for (let i = 0; i < leads.length; i++) {
    textInput += `
      <li>
        <span>
          <a target='_blank' href='${leads[i].original}'>${leads[i].edited}</a>
        </span>
        <button class='edit-btn' data-index='${i}'>&#9998;</button>
        <button class='delete-btn' data-index='${i}'>DEL </button>

      </li>
    `;
  }
  ulEl.innerHTML = textInput;

  // Add event listeners for the edit and delete buttons
  const editButtons = document.querySelectorAll(".edit-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  editButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      const index = button.getAttribute("data-index");
      const currentURL = myLeads[index].original;
      const newText = prompt("Edit the display text:", myLeads[index].edited);

      if (newText !== null) {
        myLeads[index].edited = newText;
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
      }
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      const index = button.getAttribute("data-index");
      myLeads.splice(index, 1);
      localStorage.setItem("myLeads", JSON.stringify(myLeads));
      render(myLeads);
    });
  });
}

deleteBtn.addEventListener("click", function () {
  localStorage.clear();
  myLeads = [];
  render(myLeads);
});

tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myLeads.push({ original: tabs[0].url, edited: tabs[0].url });
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
  });
});
