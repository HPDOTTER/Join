let members = [];
let subtasks = [];
let currentDraggedElement;

async function addTask(status) {
  await load();
  statusTask = status;
  await save();
  window.location.href = "../html/add-task.html";
}


function addTaskCancel() {
  window.location.href = "../html/board.html";
  renderTasks();
}


let selectedCategory = null;

const toggleCategoryDropdown = () => {
  const dropdown = document.getElementById('categoryDropdown');
  dropdown.classList.toggle('active');
};

const selectCategory = (element) => {
  const dropdown = document.getElementById('categoryDropdown');
  const button = document.querySelector('.add-task-category-button');

  // Setze den ausgewählten Wert
  selectedCategory = element.getAttribute('data-value') === 'true';

  // Aktualisiere die Button-Anzeige
  button.innerText = element.innerText;

  // Schließe das Dropdown
  dropdown.classList.remove('active');
};

// Beispiel: Zugriff auf den aktuellen Wert
//console.log(selectedCategory); // true für "User Story", false für "Technical Task"


async function addTaskSave() {
  await load();
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  // const category = document.getElementById('taskCategory').value === 'true';
  const date = document.getElementById('taskDate').value;
  const priority = parseInt(document.getElementById('taskPriority').value);

  let newTask = {
    titel: title,
    description: description,
    categoryUser: selectedCategory,
    date: new Date(date),
    priority,
    status: statusTask,
    progress: 0,
    members: members,
    subtasks: subtasks
  };

  if (title && date) {
    tasks.push(newTask);
    console.log(statusTask);
    await save();
    window.location.href = "../html/board.html";
    await renderTasks();
  }

}


const toggleDropdown = () => {
  const dropdownMenu = document.getElementById("taskAssignedToMenu");
  dropdownMenu.classList.toggle("active");
};

async function renderContactsWithCheckboxes() {
  await load();
  const dropdownMenu = document.getElementById("taskAssignedToMenu");

  contacts.forEach((contact, index) => {
    const item = document.createElement("div");
    item.className = "contact-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "contact-checkbox";
    checkbox.id = `contact-${index}`;
    checkbox.checked = false; //tasks[0].members.includes(contact.name); // Vorab ausgewählte Kontakte
    checkbox.addEventListener("change", (event) => handleCheckboxChange(event, contact));

    const label = document.createElement("label");
    label.setAttribute("for", `contact-${index}`);
    label.textContent = contact.name;

    item.appendChild(checkbox);
    item.appendChild(label);
    dropdownMenu.appendChild(item);
  });
};


const handleCheckboxChange = (event, contact) => {
  if (event.target.checked) {
    if (!members.includes(contact.name)) {
      members.push(contact.name);
    }
  } else {
    members = members.filter((member) => member !== contact.name);
  }
};


function addSubtask() {
  let inputfield = document.getElementById('subtaskInput').value;
  let subtask = document.getElementById('taskAddSubtasksContent');
  subtask.innerHTML += /*html*/`<div>${inputfield}</div>`;
  subtasks.push({ 'subtitel': inputfield, 'isDone': false });
  console.log(subtasks);
}

