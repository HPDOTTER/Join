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
  const button = document.getElementById('addTaskCategoryValue');
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
  const button = document.getElementById("addTaskAssignedToValue");
  const dropdownMenu = document.getElementById("taskAssignedToMenu");
  dropdownMenu.classList.toggle("active");
  if (dropdownMenu.classList.contains("active")) {
    button.innerHTML = "";
  } else {
    button.innerHTML = "Select contacts to assign";
  }
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
  item.appendChild(showContactAvatar(contact));
  item.appendChild(showContactName(contact));
  item.appendChild(createCheckbox(contact, index));
  item.appendChild(createLabel(contact, index));
  return item;
}

function showContactAvatar(contact) {
  const avatarColor = contact ? contact.color : 'orange';
  const avatar = document.createElement("div");
  avatar.className = "dropdown-item-avatar";
  avatar.innerHTML = getInitials(contact.name);
  avatar.style.backgroundColor = avatarColor;
  return avatar;
}


function showContactName(contact) {
  const name = document.createElement("p");
  name.innerHTML = contact.name;
  return name;
}

function taskMembers(members) {
  const membersHtml = document.getElementById("taskMembers");
  membersHtml.innerHTML = "";
  members.forEach((member) => {
    const memberHtml = document.createElement("div");
    memberHtml.className = "dropdown-item-avatar";
    memberHtml.innerHTML = getInitials(member);
    const contact = contacts.find(contact => contact.name === member);
    const avatarColor = contact ? contact.color : 'orange';
    memberHtml.style.backgroundColor = avatarColor;
    membersHtml.appendChild(memberHtml);
  });
}

function createCheckbox(contact, index) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "contact-checkbox";
  checkbox.id = `contact.${index}`;
  checkbox.checked = false;
  checkbox.addEventListener("change", (event) => handleCheckboxChange(event, contact));
  return checkbox;
}

function createLabel(contact, index) {
  const label = document.createElement("label");
  label.setAttribute("for", `contact.${index}`);
  label.textContent = contact.name;
  label.className = "contact-label";
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
  taskMembers(members, contact);
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