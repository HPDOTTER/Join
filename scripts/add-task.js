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
  window.location.href = "../html/add-task.html";
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

  return {
    titel: title,
    description: description,
    categoryUser: selectedCategory,
    date: new Date(date),
    priority: selectedPriority,
    status: statusTask,
    progress: 0,
    members: members,
    subtasks: subtasks
  };
}

selectedPriority = null;

const priorityImgactive = {
  '1': '../assets/icons/priorities/priorities-big/icon-prioritiy-big-urgent-active.svg',
  '2': '../assets/icons/priorities/priorities-big/icon-prioritiy-big-medium-active.svg',
  '3': '../assets/icons/priorities/priorities-big/icon-prioritiy-big-low-active.svg'
};

const priorityImgPrimal = {
  '1': '../assets/icons/priorities/priorities-big/icon-prioritiy-big-urgent.svg',
  '2': '../assets/icons/priorities/priorities-big/icon-prioritiy-big-medium.svg',
  '3': '../assets/icons/priorities/priorities-big/icon-prioritiy-big-low.svg'
};


function setOverlayTaskPriority(priority) {
  const priorities = ['1', '2', '3'];
  // Reset the Images of all priority elements
  priorities.forEach(p => {
    document.getElementById(p).style.content = `url(${priorityImgPrimal[p]})`;
  });
  // Set the Image of the selected priority element
  document.getElementById(priority).style.content = `url(${priorityImgactive[priority]})`;
  // Store the selected priority
  selectedPriority = priority;
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
  if (contact.name === user) {
    name.innerHTML = `${contact.name} (You)`;
  } else {
    name.innerHTML = contact.name;
  }
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


function createCheckbox(contact, index) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "contact-checkbox";
  checkbox.id = `contact.${index}`;
  if (tasks[currentTask].members) {
    checkbox.checked = tasks[currentTask].members.includes(contact.name);
  } else {
    checkbox.checked = false;
  }
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

function addSubtask() {
  let inputfield = document.getElementById('subtaskInput').value;
  let subtask = document.getElementById('taskAddSubtasksContent');
  if (window.location.href.includes('add-task.html')) {
    subtask.innerHTML += `<li class="listitems">• ${inputfield}</li>`;
  } else if (window.location.href.includes('board.html')) {
    subtask.innerHTML += `<li class="listitems editOverlaylistitems">• ${subtask.subtitel}<div class="subtaskbuttons"><button onclick="editsubtask('${subtask.subtitel}')" class="addSubtask"><img src="../assets/icons/icon-edit.png"></button><div class="subtaskDevider"></div><button onclick="overlayDeleteSubtask('${subtask.subtitel}')" class="addSubtask"><img src="../assets/icons/icon-delete.png"></button></div></li>`;
  }
  subtasks.push({ 'subtitel': inputfield, 'isDone': false });
}

function clearSubtask() {
  document.getElementById('subtaskInput').value = '';
}

function showSubtasks(index) {
  let subtaskHtml = document.getElementById('taskAddSubtasksContent');
  let subtasks = tasks[index].subtasks;
  subtaskHtml.innerHTML = '';
  if (subtasks) {
    subtasks.forEach((subtask) => {
      subtaskHtml.innerHTML += `<li class="listitems editOverlaylistitems" data-subtask-name="${subtask.subtitel}">• ${subtask.subtitel}<div class="subtaskbuttons"><button onclick="editsubtask('${subtask.subtitel}')" class="addSubtask"><img src="../assets/icons/icon-edit.png"></button><div class="subtaskDevider"></div><button onclick="overlayDeleteSubtask('${subtask.subtitel}')" class="addSubtask"><img src="../assets/icons/icon-delete.png"></button></div></li>`;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const subTaskValue = document.getElementById('subtaskInput');
  const ifSubtaskValue = document.getElementById('ifSubtaskvalue');
  const addSubtaskPlus = document.getElementById('addSubtaskPlus');

  if (subTaskValue) {
    subTaskValue.addEventListener('keyup', () => {
      const hasValue = subTaskValue.value.length > 0;
      ifSubtaskValue.style.display = hasValue ? 'flex' : 'none';
      addSubtaskPlus.style.display = hasValue ? 'none' : 'flex';
    });
  }
});

function attachSubtaskEventListeners() {
  const subTaskValue = document.getElementById('subtaskInput');
  const ifSubtaskValue = document.getElementById('ifSubtaskvalue');
  const addSubtaskPlus = document.getElementById('addSubtaskPlus');

  if (subTaskValue) {
    subTaskValue.addEventListener('keyup', () => {
      const hasValue = subTaskValue.value.length > 0;
      ifSubtaskValue.style.display = hasValue ? 'flex' : 'none';
      addSubtaskPlus.style.display = hasValue ? 'none' : 'flex';
    });
  }
}

//custom resize textarea
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

function attachCustomResizeHandle() {
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
};


