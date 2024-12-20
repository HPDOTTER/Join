/**
 * Array to store filtered tasks.
 * @type {Array}
 */ 
let filteredTasks = []; 

/**
 * Reference to the element displaying the 'no tasks' message.
 * @type {HTMLElement}
 */
const noTasksMessage = document.getElementById('noTasksMessage');

/**
 * Renders all tasks into their respective columns.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function renderTasks() {
  await load();
  const columns = document.querySelectorAll('.column .tasks');
  columns.forEach(column => (column.innerHTML = ''));
  tasksCurrentlyRendering(tasks);
  currentTask = null;
}

/**
 * Renders the provided tasks or the global tasks array into their respective columns.
 * @function
 * @param {Array} tasks - The array of tasks to render.
 */
function tasksCurrentlyRendering(tasks) {
  const tasksToRender = filteredTasks.length ? filteredTasks : tasks;
  tasksToRender.forEach((task, index) => {
    taskTemplate(task, index);
    const column = document.querySelector(`.column[data-status="${task.status}"] .tasks`);
    column.innerHTML += taskTemplate(task, index);
  });
  showDummydiv();
}

/**
 * Calculates the number of completed and total subtasks for a given task.
 * @function
 * @param {Object} task - The task object containing subtasks.
 * @returns {Object} An object containing `subtaskDone` and `subtaskCount`.
 */
function calculateSubtaskCount(task) {
  let subtaskCount = 0;
  let subtaskDone = 0;
  if (task.subtasks) {
    subtaskCount = task.subtasks.length;
    task.subtasks.forEach(element => {
      if (element.isDone == true) {
        subtaskDone += 1;
      }
    });
  }
  task.progress = subtaskDone / subtaskCount;
  return { subtaskDone, subtaskCount };
}

/**
 * Generates HTML for task members and priority.
 * @function
 * @param {Object} task - The task object.
 * @returns {string} HTML string representing members and priority.
 */
function renderMembersPrio(task) {
  let html = `<section class="members-prio"><div class="avatar">`;
  html += renderMembers(task);
  html += `</div>${setTaskPriority(task, '')}</section>`;
  return html;
}

/**
 * Generates HTML for the members of a task.
 * @function
 * @param {Object} task - The task object.
 * @returns {string} HTML string representing the task members.
 */
function renderMembers(task) {
  return task.members && task.members.length > 0
    ? task.members.map(member => {
      const contact = contacts.find(contact => contact.name === member);
      const avatarColor = contact ? contact.color : 'orange';
      return `<div class="contactAvatar" style="background-color: ${avatarColor}">${getInitials(member)}</div>`;
    }).join('')
    : '';
}

/**
 * Sets the task priority and generates the corresponding HTML.
 * @function
 * @param {Object} task - The task object.
 * @param {string} html - The initial HTML string.
 * @returns {string} Updated HTML string including priority.
 */
function setTaskPriority(task, html) {
  if (task.priority == 1) {
    html += `<div class="prio13 priodiv"><img src="../assets/img/PrioUrgent.svg" alt=""></div>`
  } else if (task.priority == 2) {
    html += `<div class="prio2 priodiv"><img src="../assets/img/PrioMedium.svg" alt=""></div>`
  } else if (task.priority == 3) {
    html += `<div class="prio13 priodiv"><img src="../assets/img/PrioLow.svg" alt=""></div>`
  }
  return html;
}

/**
 * Generates the HTML for the task title.
 * @function
 * @param {Object} task - The task object.
 * @returns {string} HTML string for the task title.
 */
function taskTitle(task) {
  if (task.titel) {
    return `<h1>${task.titel}</h1>`;
  } else {
    return '';
  }
}

/**
 * Generates the HTML for the task members assigned to a task.
 * @function
 * @param {Object} task - The task object.
 * @returns {string} HTML string for the assigned members.
 */
function taskAssignedTo(task) {
  return task.members.map(member => {
    const contact = contacts.find(contact => contact.name === member);
    const avatarColor = contact ? contact.color : 'orange';
    return getTaskAssignedToTemplate(member, avatarColor);
  }).join('');
}

/**
 * Generates the HTML for the task description.
 * @function
 * @param {Object} task - The task object.
 * @returns {string} HTML string for the task description.
 */
function taskDescription(task) {
  if (task.description) {
    return `<p class="taskDescriptionBoard">${task.description}</p>`;
  } else {
    return '';
  }
}

/**
 * Formats the task due date into a human-readable format.
 * @function
 * @param {string} dateString - The due date string.
 * @returns {string} HTML string for the formatted date.
 */
function taskDate(dateString) {
  if (dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `<div class="overlay-inline-elements"><b>Due date:</b> <p>${day}/${month}/${year}</p></div>`;
  } else {
    return '';
  }
}

/**
 * Filters tasks based on the input search text.
 * @function
 */
function filter() {
  let filterText = document.getElementById('searchTask').value.toLowerCase();
  const noTasksMessage = document.getElementById('noTasksMessage');
  if (filterText.length >= 3) {
    filteredTasks = tasks.filter(task => task.titel.toLowerCase().includes(filterText));
    if (filteredTasks.length === 0) {
      noTasksMessage.style.display = 'block';
    } else {
      noTasksMessage.style.display = 'none';
    }
  } else {
    filteredTasks = [];
    noTasksMessage.style.display = 'none';
  }
  renderTasks();
}

/**
 * Starts dragging a task by its index.
 * @function
 * @param {number} index - The index of the task to drag.
 */
function startDrag(index) {
  currentDraggedElement = index;
  const taskElement = document.querySelector(`.task[ondragstart="startDrag(${index})"]`);
  taskElement.classList.add('dragging');
}

/**
 * Allows a drop event to occur.
 * @function
 * @param {Event} ev - The drop event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves the currently dragged task to a new status.
 * @async
 * @function
 * @param {string} status - The new status for the task.
 * @returns {Promise<void>}
 */
async function moveTo(status) {
  tasks[currentDraggedElement]['status'] = status;
  await save();
  await renderTasks();
  removeHighlight(status);
}

/**
 * Highlights the column for a specific status during a drag operation.
 * @function
 * @param {string} status - The status to highlight.
 */
function highlight(status) {
  const column = document.querySelector(`.column[data-status="${status}"] .tasks`);
  column.classList.add('highlight');
}

/**
 * Removes the highlight from a column after a drag operation.
 * @function
 * @param {string} status - The status to remove the highlight from.
 */
function removeHighlight(status) {
  const column = document.querySelector(`.column[data-status="${status}"] .tasks`);
  column.classList.remove('highlight');
}

/**
 * Array of dummy messages for empty task columns.
 * @constant {Array<string>}
 */
const dummyMessages = [
  'No tasks to do',
  'No tasks in progress',
  'No tasks awaiting Feedback',
  'No tasks done'
];

/**
 * Displays a dummy message in empty columns.
 * @function
 */
function showDummydiv() {
  for (let i = 1; i <= 4; i++) {
    const column = document.querySelector(`.column[data-status='${i}'] .tasks`);
    if (column && column.children.length === 0) {
      const dummyDiv = document.createElement('div');
      dummyDiv.classList.add('dummy');
      dummyDiv.innerText = dummyMessages[i - 1];
      column.appendChild(dummyDiv);
    }
  }
}

/**
 * Toggles the visibility of the task status selection menu.
 * @function
 * @param {Event} event - The click event.
 * @param {number} index - The index of the task.
 */
function toggleTaskStatusSelectionMenu(event, index) {
  let menu = document.getElementById(`taskStatusSelectionMenu${index}`);
  menu.classList.toggle('d-none');
  event.stopPropagation();
}

/**
 * Sets the status of a task and updates the UI.
 * @async
 * @function
 * @param {Event} event - The click event.
 * @param {string} taskStatus - The new status for the task.
 * @param {number} index - The index of the task.
 * @returns {Promise<void>}
 */
async function setTaskStatus(event, taskStatus, index) {
  toggleTaskStatusSelectionMenu(event, index);
  tasks[index]['status'] = taskStatus;
  await save();
  await renderTasks();
}
