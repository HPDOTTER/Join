/**
 * Array to hold members assigned to a task.
 * @type {Array}
 */
let members = [];

/**
 * Array to hold subtasks of a task.
 * @type {Array}
 */
let subtasks = [];

/**
 * Currently dragged element in a drag-and-drop interaction.
 * @type {HTMLElement | null}
 */
let currentDraggedElement;

/**
 * Selected category for the task.
 * @type {boolean | null}
 */
let selectedCategory = null;

/**
 * Adds a new task and navigates to the add-task page.
 * @param {string} status - The status of the task to be added.
 */
async function addTask(status) {
  openNewTaskOverlay();
  statusTask = status;
  await save();
  await load();
}

async function addTaskCancel() {
  window.location.href = "../html/add-task.html";
  await renderTasks();
}

/**
 * Toggles the visibility of the category dropdown.
 */
const toggleCategoryDropdown = () => {
  const dropdown = document.getElementById('categoryDropdown');
  dropdown.classList.toggle('active');
};

/**
 * Selects a category from the dropdown.
 * @param {HTMLElement} element - The dropdown item element.
 */
const selectCategory = (element) => {
  const dropdown = document.getElementById('categoryDropdown');
  const button = document.getElementById('addTaskCategoryValue');
  selectedCategory = element.getAttribute('data-value') === 'true';
  button.innerText = element.innerText;
  dropdown.classList.remove('active');
};

/**
 * Saves the newly created task and navigates to the board page.
 */
async function addTaskSave() {
  const newTask = createNewTask();
  if (newTask.titel && newTask.date) {
    tasks.push(newTask);
    await save();
    window.location.href = "../html/board.html";
    await load();
    await renderTasks();
  }
}

/**
 * Creates a new task object based on form inputs.
 * @returns {Object} - The newly created task object.
 */
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

/**
 * Selected priority for the task.
 * @type {string | null}
 */
selectedPriority = null;

/**
 * Image paths for active priority states.
 * @type {Object}
 */
const priorityImgactive = {
  '1': '../assets/icons/priorities/priorities-big/icon-prioritiy-big-urgent-active.svg',
  '2': '../assets/icons/priorities/priorities-big/icon-prioritiy-big-medium-active.svg',
  '3': '../assets/icons/priorities/priorities-big/icon-prioritiy-big-low-active.svg'
};

/**
 * Image paths for default priority states.
 * @type {Object}
 */
const priorityImgPrimal = {
  '1': '../assets/icons/priorities/priorities-big/icon-prioritiy-big-urgent.svg',
  '2': '../assets/icons/priorities/priorities-big/icon-prioritiy-big-medium.svg',
  '3': '../assets/icons/priorities/priorities-big/icon-prioritiy-big-low.svg'
};

/**
 * Sets the priority of a task visually and updates its state.
 * @param {string} priority - The selected priority level.
 */
async function setOverlayTaskPriority(priority) {
  const priorities = ['1', '2', '3'];
  priorities.forEach(p => {
    document.getElementById(p).style.content = `url(${priorityImgPrimal[p]})`;
  });
  document.getElementById(priority).style.content = `url(${priorityImgactive[priority]})`;
  selectedPriority = priority;
  if (currentTask) {
    tasks[currentTask].priority = priority;
    await setEditOverlayTaskPriority(priority);
  }
}

/**
 * Toggles the visibility of the "Assigned To" dropdown menu.
 */
const toggleDropdown = () => {
  const button = document.getElementById("addTaskAssignedToValue");
  const dropdownMenu = document.getElementById("taskAssignedToMenu");
  dropdownMenu.classList.toggle("active");
  button.innerHTML = dropdownMenu.classList.contains("active") ? "" : "Select contacts to assign";
};

/**
 * Renders contacts as dropdown items with checkboxes for selection.
 */
async function renderContactsWithCheckboxes() {
  await load();
  const dropdownMenu = document.getElementById("taskAssignedToMenu");
  if (!dropdownMenu || !contacts || contacts.length === 0) {
    return;
  }
  contacts.forEach((contact, index) => {
    const item = createDropdownItem(contact, index);
    dropdownMenu.appendChild(item);
  });
}

/**
 * Creates a dropdown item for a contact.
 * @param {Object} contact - The contact object.
 * @param {number} index - The index of the contact in the list.
 * @returns {HTMLElement} - The created dropdown item element.
 */
function createDropdownItem(contact, index) {
  const item = document.createElement("div");
  item.className = "dropdown-item";
  item.appendChild(showContactAvatar(contact));
  item.appendChild(showContactName(contact));
  item.appendChild(createCheckbox(contact, index));
  item.appendChild(createLabel(contact, index));
  return item;
}

/**
 * Creates an avatar element for a contact.
 * @param {Object} contact - The contact object.
 * @returns {HTMLElement} - The avatar element.
 */
function showContactAvatar(contact) {
  const avatarColor = contact ? contact.color : 'orange';
  const avatar = document.createElement("div");
  avatar.className = "dropdown-item-avatar";
  avatar.innerHTML = getInitials(contact.name);
  avatar.style.backgroundColor = avatarColor;
  return avatar;
}

/**
 * Creates a name element for a contact.
 * @param {Object} contact - The contact object.
 * @returns {HTMLElement} - The name element.
 */
function showContactName(contact) {
  const name = document.createElement("p");
  name.innerHTML = contact.name === user ? `${contact.name} (You)` : contact.name;
  return name;
}

/**
 * Updates the displayed task members based on the provided list.
 * @param {string[]} members - Array of member names to be displayed.
 */
function taskMembers(members) {
  const membersHtml = document.getElementById("taskMembers");
  membersHtml.innerHTML = "";
  if (members && members.length > 0) {
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
  ifCurrentTaskPushMembers(members);
}

/**
 * Handles changes to a member's checkbox selection.
 * @param {Event} event - The change event triggered by the checkbox.
 * @param {Object} contact - The contact object associated with the checkbox.
 */
const handleCheckboxChange = (event, contact) => {
  if (event.target.checked) {
    if (!members.includes(contact.name)) {
      members.push(contact.name);
      if (tasks[currentTask] && tasks[currentTask].members) {
        tasks[currentTask].members.forEach((member) => {
          if (!members.includes(member)) {
            members.push(member);
          }
        });
      }
    }
  } else {
    members = members.filter((member) => member !== contact.name);
  }
  taskMembers(members);
};

/**
 * Creates a checkbox element for a contact.
 * @param {Object} contact - The contact object for which the checkbox is created.
 * @param {number} index - The index of the contact.
 * @returns {HTMLElement} The created checkbox element.
 */
function createCheckbox(contact, index) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "contact-checkbox";
  checkbox.id = `contact.${index}`;
  if (tasks[currentTask] && tasks[currentTask].members) {
    checkbox.checked = tasks[currentTask].members.includes(contact.name);
  } else {
    checkbox.checked = false;
  }
  checkbox.addEventListener("change", (event) => handleCheckboxChange(event, contact));
  return checkbox;
}

/**
 * Creates a label element for a contact's checkbox.
 * @param {Object} contact - The contact object for which the label is created.
 * @param {number} index - The index of the contact.
 * @returns {HTMLElement} The created label element.
 */
function createLabel(contact, index) {
  const label = document.createElement("label");
  label.setAttribute("for", `contact.${index}`);
  label.textContent = contact.name;
  label.className = "contact-label";
  return label;
}

/**
 * Adds a new subtask to the current task.
 */
function addSubtask() {
  let inputfield = document.getElementById('subtaskInput').value;
  let subtask = document.getElementById('taskAddSubtasksContent');
  if (window.location.href.includes('add-task.html')) {
    subtask.innerHTML += `<li class="listitems">• ${inputfield}</li>`;
  } else if (window.location.href.includes('board.html')) {
    subtask.innerHTML += `<li class="listitems editOverlaylistitems">• ${subtask.subtitel}<div class="subtaskbuttons"><button onclick="overlayEditSubtask('${subtask.subtitel}')" class="addSubtask"><img src="../assets/icons/icon-edit.png"></button><div class="subtaskDevider"></div><button onclick="overlayDeleteSubtask('${subtask.subtitel}')" class="addSubtask"><img src="../assets/icons/icon-delete.png"></button></div></li>`;
  }
  subtasks.push({ 'subtitel': inputfield, 'isDone': false });
  clearSubtask();
}

/**
 * Clears the subtask input field.
 */
function clearSubtask() {
  document.getElementById('subtaskInput').value = '';
}

/**
 * Displays the subtasks for a given task index.
 * @param {number} index - The index of the task.
 */
async function showSubtasks(index) {
  await load();
  let subtaskHtml = document.getElementById('taskAddSubtasksContent');
  let subtasks = tasks[index].subtasks;
  subtaskHtml.innerHTML = '';
  if (subtasks) {
    subtasks.forEach((subtask) => {
      subtaskHtml.innerHTML += `<li class="listitems editOverlaylistitems" data-subtask-name="${subtask.subtitel}">• ${subtask.subtitel}<div class="subtaskbuttons"><button onclick="overlayEditSubtask('${subtask.subtitel}')" class="addSubtask"><img src="../assets/icons/icon-edit.png"></button><div class="subtaskDevider"></div><button onclick="overlayDeleteSubtask('${subtask.subtitel}')" class="addSubtask"><img src="../assets/icons/icon-delete.png"></button></div></li>`;
    });
  }
}

/**
 * Attaches event listeners to subtask input and controls.
 */
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

/**
 * Adds event listeners for starting the resize action when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.querySelector('.add-task-textarea');
  const resizeHandle = document.querySelector('.custom-resize-handle');
  if (resizeHandle) {
    resizeHandle.addEventListener('mousedown', startResize);
  }
});

/**
 * Starts the resize process when the mouse is pressed on the resize handle.
 * @param {MouseEvent} e - The mouse event triggered when the mouse button is pressed.
 */
function startResize(e) {
  e.preventDefault();
  const textarea = document.querySelector('.add-task-textarea');
  const startY = e.clientY, startHeight = parseInt(window.getComputedStyle(textarea).height, 10);

  /**
   * Updates the textarea height while dragging.
   * @param {MouseEvent} e - The mouse event triggered during the drag.
   */
  const onDrag = (e) => textarea.style.height = `${startHeight + e.clientY - startY}px`;

  /**
   * Stops the resize process when the mouse button is released.
   */
  const onStopDrag = () => {
    document.documentElement.removeEventListener('mousemove', onDrag);
    document.documentElement.removeEventListener('mouseup', onStopDrag);
  };
  document.documentElement.addEventListener('mousemove', onDrag);
  document.documentElement.addEventListener('mouseup', onStopDrag);
}


// alt:
// document.addEventListener('DOMContentLoaded', () => {
//   const textarea = document.querySelector('.add-task-textarea');
//   const resizeHandle = document.querySelector('.custom-resize-handle');
//   if (resizeHandle) {
//     resizeHandle.addEventListener('mousedown', function(e) {
//       e.preventDefault();
//       const startY = e.clientY;
//       const startHeight = parseInt(document.defaultView.getComputedStyle(textarea).height, 10);
//       function doDrag(e) {
//         textarea.style.height = (startHeight + e.clientY - startY) + 'px';
//       }
//       function stopDrag() {
//         document.documentElement.removeEventListener('mousemove', doDrag, false);
//         document.documentElement.removeEventListener('mouseup', stopDrag, false);
//       }
//       document.documentElement.addEventListener('mousemove', doDrag, false);
//       document.documentElement.addEventListener('mouseup', stopDrag, false);
//     }, false);
//   }
// });

/**
 * Attaches a resize handle for a textarea to allow custom resizing.
 */


// alt:
// function attachCustomResizeHandle() {
//   const textarea = document.querySelector('.add-task-textarea');
//   const resizeHandle = document.querySelector('.custom-resize-handle');
//   if (resizeHandle) {
//     resizeHandle.addEventListener('mousedown', function(e) {
//       e.preventDefault();
//       const startY = e.clientY;
//       const startHeight = parseInt(document.defaultView.getComputedStyle(textarea).height, 10);
//       function doDrag(e) {
//         textarea.style.height = (startHeight + e.clientY - startY) + 'px';
//       }
//       function stopDrag() {
//         document.documentElement.removeEventListener('mousemove', doDrag, false);
//         document.documentElement.removeEventListener('mouseup', stopDrag, false);
//       }
//       document.documentElement.addEventListener('mousemove', doDrag, false);
//       document.documentElement.addEventListener('mouseup', stopDrag, false);
//     }, false);
//   }
// }
