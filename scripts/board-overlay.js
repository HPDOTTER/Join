/**
 * @type {HTMLElement} overlay - The task overlay element.
 */
const overlay = document.getElementById('taskOverlay');

/**
 * @type {number|null} currentTask - The index of the currently opened task in the task list.
 */
let currentTask = null;

/**
 * Opens the task overlay for the given task index.
 * @param {number} index - The index of the task to open.
 */
function openTaskOverlay(index) {
  const task = tasks[index];
  overlay.innerHTML = getOpenTaskOverlayTemplate(task, index);
  showOverlay();
  currentTask = index;
}

// Event listener for closing the overlay when clicking outside.
document.addEventListener('DOMContentLoaded', () => {
  if (overlay) {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        hideOverlay();
      }
    });
  }
});

/**
 * Displays the overlay by adding a class.
 */
function showOverlay() {
  overlay.classList.add('show');
}

/**
 * Hides the overlay with an animation effect.
 */
function hideOverlay() {
  const taskOverlayContent = document.getElementById('task-overlay-content');
  taskOverlayContent.classList.remove('animation-slide-from-bottom');
  taskOverlayContent.classList.add('animation-slide-from-top');
  setTimeout(() => {
    overlay.classList.remove('show');
    taskOverlayContent.classList.remove('animation-slide-from-top');
    taskOverlayContent.classList.add('animation-slide-from-bottom');
  }, 500);
}

/**
 * Deletes the task at the specified index and updates the tasks list.
 * @param {number} index - The index of the task to delete.
 */
async function deleteTask(index) {
  tasks.splice(index, 1);
  await save();
  await renderTasks();
  hideOverlay();
}

/**
 * Returns the HTML for subtasks if they exist for the task.
 * @param {Object} task - The task object.
 * @param {number} taskIndex - The index of the task.
 * @returns {string} - HTML string for subtasks.
 */
function ifSubtasks(task, taskIndex) {
  if (task.subtasks && task.subtasks.length > 0) {
    return `<div class="overlay-subtasks">
                <b>Subtasks:</b>
                ${overlaySubTasks(task, taskIndex)}
              </div>`;
  } else {
    return '';
  }
}

/**
 * Generates the HTML for subtasks within the overlay.
 * @param {Object} task - The task object.
 * @param {number} taskIndex - The index of the task.
 * @returns {string} - HTML string for subtasks.
 */
function overlaySubTasks(task, taskIndex) {
  return task.subtasks.map((subtask, subtaskIndex) => {
    const checkboxId = `subtask-${taskIndex}-${subtaskIndex}`;
    return getOverlaySubtaskHtml(subtask, taskIndex, subtaskIndex, checkboxId);
  }).join('');
}

/**
 * Toggles the "done" state of a subtask and updates the UI.
 * @param {number} taskIndex - The index of the task.
 * @param {number} subtaskIndex - The index of the subtask.
 */
async function overlaySubtaskCheckbox(taskIndex, subtaskIndex) {
  const task = tasks[taskIndex];
  const subtask = task.subtasks[subtaskIndex];
  const checkboxId = `subtask-${taskIndex}-${subtaskIndex}`;
  subtask.isDone = !subtask.isDone;
  document.getElementById(checkboxId).checked = subtask.isDone;
  await save();
  await renderTasks();
}

/**
 * Returns the priority HTML for the task based on its priority level.
 * @param {Object} task - The task object.
 * @returns {string} - HTML string for the priority section.
 */
function taskPriority(task) {
  if (task.priority) {
    const priorityLabels = ['Urgent', 'Medium', 'Low'];
    const priorityIcons = ['PrioUrgent', 'PrioMedium', 'PrioLow'];
    return `<div class="overlay-priority-div">
              <b>Priority:</b>
              <p>${priorityLabels[task.priority - 1]}</p>
              <div class="prio13 priodiv">
                <img src="../assets/img/${priorityIcons[task.priority - 1]}.svg">
              </div>
            </div>`;
  } else {
    return '';
  }
}

/**
 * Opens the edit task overlay for the specified task index.
 * @param {number} index - The index of the task to edit.
 */
function openEditTaskOverlay(index) {
  const task = tasks[index];
  overlay.innerHTML = getEditTaskOverlayTemplate(index, task);
  getTaskPriority(task);
  renderContactsWithCheckboxes();
  taskMembers(task.members);
  attachSubtaskEventListeners();
  attachCustomResizeHandle();
  showSubtasks(index);
}

/**
 * Updates the task priority icon based on the given task's priority level.
 * @param {Object} task - The task object containing the priority level.
 */
function getTaskPriority(task) {
  const priority = task.priority;
  document.getElementById(priority).style.content = `url(${priorityImgactive[priority]})`;
}

/**
 * Formats a date string into the format "YYYY-MM-DD".
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date.
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the category of the task as a string.
 * @param {Object} task - The task object.
 * @returns {string} - "User Story" if the task is a user story, otherwise "Technical Task".
 */
function overlayTaskCategory(task) {
  return task.categoryUser ? 'User Story' : 'Technical Task';
}

/**
 * Generates the HTML for a subtask, including its edit buttons.
 * @param {Object} subtask - The subtask object.
 * @param {string} name - The name of the subtask.
 * @returns {string} - HTML string for the subtask.
 */
function subtaskHTML(subtask, name) {
  return `<input class="overlayEditSubtask" type="text" value="${subtask.subtitel}">
          <div class="subtaskbuttons">
            <button onclick="overlayDeleteSubtask('${subtask.subtitel}')" class="addSubtask">
              <img src="../assets/icons/icon-delete.png">
            </button>
            <div class="subtaskDevider"></div>
            <button onclick="overlayAcceptChangedSubtask('${subtask.subtitel}')" class="addSubtask">
              <img src="../assets/icons/icon-check-active.png">
            </button>
          </div>`;
}

/**
 * Enables editing mode for a specific subtask.
 * @param {string} name - The name of the subtask to edit.
 */
function overlayEditSubtask(name) {
  const task = tasks[currentTask];
  const subtask = task.subtasks.find(subtask => subtask.subtitel === name);
  const listItem = document.querySelector(`li[data-subtask-name="${name}"]`);
  listItem.innerHTML = subtaskHTML(subtask, name);
  listItem.classList.add('overlaySubtaskEdit');
  listItem.classList.remove('editOverlaylistitems');
}

/**
 * Deletes a subtask from the current task.
 * @param {string} subtaskSubtitel - The name of the subtask to delete.
 */
async function overlayDeleteSubtask(subtaskSubtitel) {
  const task = tasks[currentTask];
  const subtaskIndex = task.subtasks.findIndex(subtask => subtask.subtitel === subtaskSubtitel);
  task.subtasks.splice(subtaskIndex, 1);
  await SaveLoadRender();
  showSubtasks(currentTask);
}

/**
 * Accepts and saves changes to a subtask.
 * @param {string} subtaskSubtitel - The name of the subtask to save changes for.
 */
async function overlayAcceptChangedSubtask(subtaskSubtitel) {
  const task = tasks[currentTask];
  const subtask = task.subtasks.find(subtask => subtask.subtitel === subtaskSubtitel);
  const listItem = document.querySelector(`li[data-subtask-name="${subtaskSubtitel}"]`);
  const input = listItem.querySelector('input');
  subtask.subtitel = input.value;
  listItem.classList.remove('overlaySubtaskEdit');
  listItem.classList.add('editOverlaylistitems');
  await SaveLoadRender();
  await showSubtasks(currentTask);
}

/**
 * Updates the task title for the current task.
 */
async function editTaskTitle() {
  const task = tasks[currentTask];
  const input = document.getElementById('editTaskTitle');
  task.titel = input.value;
  await SaveLoadRender();
}

/**
 * Updates the task description for the current task.
 */
async function overlayEditTaskDescription() {
  const task = tasks[currentTask];
  const input = document.getElementById('editTaskDescription');
  task.description = input.value;
  await SaveLoadRender();
}

/**
 * Updates the task date for the current task.
 */
async function overlayEditDate() {
  const task = tasks[currentTask];
  const input = document.getElementById('editTaskDate');
  task.date = input.value;
  await SaveLoadRender();
}

/**
 * Sets the priority for the current task in the overlay.
 * @param {number} priority - The priority level to set (1 = Urgent, 2 = Medium, 3 = Low).
 */
async function setEditOverlayTaskPriority(priority) {
  const task = tasks[currentTask];
  task.priority = priority;
  await SaveLoadRender();
}

/**
 * Updates the members of the current task.
 * @param {string[]} members - Array of member names to assign to the task.
 */
async function ifCurrentTaskPushMembers(members) {
  if (currentTask) {
    const task = tasks[currentTask];
    task.members = members;
    await SaveLoadRender();
  }
}

/**
 * Adds a new subtask to the current task.
 */
async function overlayAddSubtask() {
  const task = tasks[currentTask];
  const input = document.getElementById('subtaskInput');
  if (!task.subtasks) {
    task.subtasks = [];
  }
  task.subtasks.push({ subtitel: input.value, isDone: false });
  input.value = '';
  await SaveLoadRender();
  showSubtasks(currentTask);
}

/**
 * Saves, reloads, and re-renders the tasks list.
 */
async function SaveLoadRender() {
  await save();
  await load();
  renderTasks();
}

/**
 * Updates the overlay with the HTML content for the specified task index.
 * @param {number} index - The index of the task to display in the overlay.
 */
function getOverlayHtml(index) {
  const task = tasks[index];
  overlay.innerHTML = getOpenTaskOverlayTemplate(task, index);
}

/**
 * Generates the HTML template for editing a task in the overlay.
 * @param {number} index - The index of the task in the tasks array.
 * @param {Object} task - The task object to be edited.
 * @returns {string} - The HTML string for the edit task overlay.
 */


/**
 * Opens the new task overlay and sets up its content.
 */
function openNewTaskOverlay(status) {
  const newTaskOverlay = document.getElementById('new-task-overlay');
  const taskOverlayWrapper = document.getElementById('taskOverlayWrapper');
  taskOverlayWrapper.style.setProperty('display', 'block', 'important');
  newTaskOverlay.style.display = 'block';
  newTaskOverlay.classList.remove('hidden');
  newTaskOverlay.innerHTML = getNewTaskOverlayTemplate();
  renderContactsWithCheckboxes();
  attachSubtaskEventListeners();
  selectDefaultCategory();
  statusTask = status;
  setOverlayTaskPriority('2');
}

/**
 * Closes the new task overlay by hiding it.
 */
function closeNewTaskOverlay() {
  const newTaskOverlay = document.getElementById('new-task-overlay');
  const taskOverlayWrapper = document.getElementById('taskOverlayWrapper');
  taskOverlayWrapper.style.setProperty('display', 'none', 'important');
  newTaskOverlay.classList.add('hidden');
  setTimeout(() => {
    newTaskOverlay.style.display = 'none';
  }, 190); // Match the duration of the animation
}

/**
 * Initializes event listeners for closing the overlay when clicking outside of it.
 */
document.addEventListener('DOMContentLoaded', () => {
  const addTaskOverlay = document.getElementById('taskOverlayWrapper');
  if (addTaskOverlay) {
    addTaskOverlay.addEventListener('click', (event) => {
      if (event.target === addTaskOverlay) {
        closeNewTaskOverlay();
      }
    });
  }
});
