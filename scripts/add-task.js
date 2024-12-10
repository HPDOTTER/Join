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
  const newTask = createNewTask();
  if (newTask.titel && newTask.date) {
    tasks.push(newTask);
    await save();
    window.location.href = "../html/board.html";
    await renderTasks();
  }
}

function createNewTask() {
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const date = document.getElementById('taskDate').value;
  const priority = parseInt(document.getElementById('taskPriority').value);

  return {
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
}


const toggleDropdown = () => {
  const dropdownMenu = document.getElementById("taskAssignedToMenu");
  dropdownMenu.classList.toggle("active");
};

async function renderContactsWithCheckboxes() {
  await load();
  const dropdownMenu = document.getElementById("taskAssignedToMenu");
  contacts.forEach((contact, index) => {
    const item = createDropdownItem(contact, index);
    dropdownMenu.appendChild(item);
  });
}

function createDropdownItem(contact, index) {
  const item = document.createElement("div");
  item.className = "dropdown-item";
  const checkbox = createCheckbox(contact, index);
  const label = createLabel(contact, index);
  item.appendChild(checkbox);
  item.appendChild(label);
  return item;
}

function createCheckbox(contact, index) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "contact-checkbox";
  checkbox.id = `contact-${index}`;
  checkbox.checked = false;
  checkbox.addEventListener("change", (event) => handleCheckboxChange(event, contact));
  return checkbox;
}

function createLabel(contact, index) {
  const label = document.createElement("label");
  label.setAttribute("for", `contact-${index}`);
  label.textContent = contact.name;
  return label;
}

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

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.querySelector('.add-task-textarea');
  const resizeHandle = document.querySelector('.custom-resize-handle');

  if (resizeHandle) {
    resizeHandle.addEventListener('mousedown', function(e) {
      e.preventDefault();

      const startY = e.clientY;
      const startHeight = parseInt(document.defaultView.getComputedStyle(textarea).height, 10);

      function doDrag(e) {
        textarea.style.height = (startHeight + e.clientY - startY) + 'px';
      }

      function stopDrag() {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
      }

      document.documentElement.addEventListener('mousemove', doDrag, false);
      document.documentElement.addEventListener('mouseup', stopDrag, false);
    }, false);
  }
});