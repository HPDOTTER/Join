/**
 * Generates the HTML template for a task.
 * @function
 * @param {Object} task - The task object.
 * @param {number} index - The index of the task.
 * @returns {string} HTML string representing the task.
 */
function taskTemplate(task, index) {
  return `<div id="task${index}" class="task" draggable="true" ondragstart="startDrag(${index})" onclick="openTaskOverlay(${index})">
        <div class="task-top-section">
        <span class="category ${task.categoryUser ? 'user' : 'technical'}">
            ${task.categoryUser ? 'User Story' : 'Technical Task'}
        </span>
        <img class="task-status-selection-arrow" src="../assets/icons/icon-arrow-down.svg" onclick="toggleTaskStatusSelectionMenu(event, ${index})">
        <div id="taskStatusSelectionMenu${index}" class="task-status-selection-menu d-none">
          <div class="task-status-selection-menu-item" onclick="setTaskStatus(event, 1, ${index})">To do</div>
          <div class="task-status-selection-menu-item" onclick="setTaskStatus(event, 2, ${index})">In Progress</div>
          <div class="task-status-selection-menu-item" onclick="setTaskStatus(event, 3, ${index})">Await Feedback</div>
          <div class="task-status-selection-menu-item" onclick="setTaskStatus(event, 4, ${index})">Done</div>
        </div>
        </div>
        <h3>${task.titel}</h3>
        ${taskDescription(task)}
        ${rendersubtaskCount(task)}
        ${renderMembersPrio(task)}
    </div>`;
}

/**
 * Renders the subtask progress and count for a task.
 * @function
 * @param {Object} task - The task object.
 * @returns {string} HTML string for subtask progress and count.
 */
function rendersubtaskCount(task) {
  if (task.subtasks) {
    const { subtaskDone, subtaskCount } = calculateSubtaskCount(task);
    return `<section class="progress-section">
        <div class="progress-bar">
          <div class="progress" style="width: ${task.progress * 100}%;"></div>
        </div>
        <div>${subtaskDone}/${subtaskCount} Subtasks</div>
      </section>`;
  } else {
    return '';
  }
}

/**
 * Generates the HTML template for the task overlay.
 * @function
 * @param {Object} task - The task object.
 * @param {number} index - The index of the task.
 * @returns {string} HTML string for the task overlay.
 */
function getOpenTaskOverlayTemplate(task, index) {
  return `
    <div class="task-overlay-content animation-slide-from-bottom" id="task-overlay-content">
        <div class="task-overlay-head">
          ${taskCategory(task)}
          <div>
            <img src="../assets/icons/close.svg" class="close-overlay" onclick="hideOverlay()">
          </div>
        </div>
        ${taskTitle(task)}
        ${taskDescription(task)}
        ${taskDate(task.date)}
        ${taskPriority(task)}
        ${ifTaskMembers(task)}
        ${ifSubtasks(task, index)}
        <span class="overlay-edit-footer">
          <div class="task-overlay-editors" onclick="deleteTask(${index})"><img src="../assets/icons/icon-delete.png"><p>Delete</p></div>
          <div class="task-overlay-devider"></div>
          <div class="task-overlay-editors" onclick="openEditTaskOverlay(${index})"><img src="../assets/icons/icon-edit.png"><p>Edit</p></div>
        </span>
      </div>`;
}

/**
 * Generates the HTML for a subtask in the overlay.
 * @function
 * @param {Object} subtask - The subtask object.
 * @param {number} taskIndex - The index of the parent task.
 * @param {number} subtaskIndex - The index of the subtask.
 * @param {string} checkboxId - The ID of the checkbox element.
 * @returns {string} HTML string for the subtask.
 */
function getOverlaySubtaskHtml(subtask, taskIndex, subtaskIndex, checkboxId) {
  return `<div class="overlay-subtask">
              <input type="checkbox" id="${checkboxId}" ${subtask.isDone ? 'checked' : ''}>
              <label onclick="overlaySubtaskCheckbox(${taskIndex}, ${subtaskIndex})"></label>
              <p>${subtask.subtitel}</p>
            </div>`;
}

/**
 * Generates the HTML for the task category.
 * @function
 * @param {Object} task - The task object.
 * @returns {string} HTML string for the task category.
 */
function taskCategory(task) {
  return `<span class="category ${task.categoryUser ? 'user' : 'technical'}">
            ${task.categoryUser ? 'User Story' : 'Technical Task'}
          </span>`;
}

/**
 * Generates the HTML for assigned task members if any.
 * @function
 * @param {Object} task - The task object.
 * @returns {string} HTML string for the assigned members or empty string if none.
 */
function ifTaskMembers(task) {
  if (task.members && task.members.length > 0) {
    return `<div class="overlay-tasks-assigned-to">
                <b>Assigned to:</b>
                ${taskAssignedTo(task)}
              </div>`;
  } else {
    return '';
  }
}

/**
 * Generates the HTML template for a task member's avatar and name.
 * @function
 * @param {string} member - The member's name.
 * @param {string} avatarColor - The background color for the avatar.
 * @returns {string} HTML string for the task member.
 */
function getTaskAssignedToTemplate(member, avatarColor) {
  return `<div class="overlay-avatar">
              <div class="contactAvatar margin-right-10" style="background-color: ${avatarColor}">
                ${getInitials(member)}
              </div>
              ${member}
            </div>`;
}

function getEditTaskOverlayTemplate(index, task) {
  const formattedDates = formatDate(task.date);
  const taskMembersHtml = `
    <div class="task-overlay-content" id="task-overlay-content">
      <div class="task-overlay-head">
        <div></div>
        <div>
          <img src="../assets/icons/close.svg" class="close-overlay" onclick="hideOverlay()">
        </div>
      </div>
        <div class="add-task-info-element">
          <div class="input-wrapper">
            <input type="text" class="input add-task-input-title" id="editTaskTitle" value="${task.titel}" onkeyup="editTaskTitle()" required>
          </div>
        </div>
        <div class="add-task-info-element">
          <label for="taskDescription">Description</label>
          <textarea id="editTaskDescription" class="add-task-textarea" onkeyup="overlayEditTaskDescription()">${task.description}</textarea>
          <div class="custom-resize-handle"></div>
        </div>
        <div class="add-task-info-element">
          <label for="taskDate">Due date</label>
          <div class="input-wrapper">
            <input type="date" placeholder="dd/mm/yyyy" class="input" id="editTaskDate" onchange="overlayEditDate()" value="${formattedDates}" required>
            <img src="../assets/icons/icon-calender.jpg" class="add-task-input-date-icon">
          </div>
        </div>
        <div class="add-task-info-element">
          <label for="taskPriority">Priority</label>
          <div id="editTaskPriority" class="add-task-priority-area">
            <img class="icon-add-task-priority-urgent pointer" id="1" onclick="setOverlayTaskPriority('1')">
            <img class="icon-add-task-priority-medium pointer" id="2" onclick="setOverlayTaskPriority('2')">
            <img class="icon-add-task-priority-low pointer" id="3" onclick="setOverlayTaskPriority('3')">
          </div>
        </div>
        <div class="add-task-info-element">
          <label for="taskAssignedTo">Assigned to</label>
          <button class="add-task-assigned-to-button" onclick="toggleDropdown()">
            <p id="addTaskAssignedToValue">Select contacts to assign</p>
            <img class="icon-add-task-assigned-to-button-arrow">
          </button>
          <div id="taskAssignedToMenu" class="dropdown-menu">
            <!-- Dynamisch generierte Kontakte mit Checkboxen -->
          </div>
          <div class="dropdown-item"></div>
          <div class="dropdown-menu">
            <div class="dropdown-item active" id="dropdown-item">
            </div>
          </div>
        </div>
        <div id="taskMembers"></div>
        <div class="add-task-info-element">
          <div class="add-task-info-element-header">Subtasks</span></div>
          <div class="add-task-category-button">
            <input type="text" id="subtaskInput" placeholder="Add new subtask">
            <div class="ifSubtaskvalue" id="ifSubtaskvalue">
              <button onclick="clearSubtask()" class="clearSubtask"><img src="../assets/icons/close.svg"></button>
              <div class="subtaskDevider"></div>
              <button onclick="overlayAddSubtask()" class="addSubtask"><img src="../assets/icons/icon-check-active.png"></button>
            </div>
            <label for="subtaskInput" id="addSubtaskPlus"><img class="icon-add-subtask-button-plus"></label>
          </div>
          <ul id="taskAddSubtasksContent">
          </ul>
        </div>
      <span class="overlay-edit-footer">
        <button class="button-primary overlay-done-button" onclick="getOverlayHtml(${index})">Ok <img src="../assets/icons/icon-whitecheck.svg"></button>
      </span>
    </div>
  `;
  return taskMembersHtml;
}

/**
 * Generates the HTML template for creating a new task in the overlay.
 * @returns {string} - The HTML string for the new task overlay.
 */
function getNewTaskOverlayTemplate() {
  const newTaskOverlayHtml = `
      <form onsubmit="addTaskSave(event)" id="taskAdd" class="add-task-area board-add-task-area">
          <div class="new-task-overlay-header">
            <h1>Add Task</h1>
            <button type="button" onclick="closeNewTaskOverlay()"><img src="../assets/icons/close.svg" class="close-overlay"></button>
          </div>  
            <div class="add-task-info-element">
              <div class="input-wrapper">
                <input type="text" placeholder="Enter a title" class="input add-task-input-title" id="taskTitle" required="">
              </div>
            </div>
            <div class="add-task-info-element">
              <label for="taskDescription">Description <span>(optional)</span></label>
              <textarea id="taskDescription" placeholder="Enter a description" class="add-task-textarea"></textarea>
              <div class="custom-resize-handle"></div>
            </div>
            <div class="add-task-info-element">
              <label for="taskDate">Due date</label>
              <div class="input-wrapper">
                <input type="date" placeholder="dd/mm/yyyy" class="input" id="taskDate" required="">
                <img src="../assets/icons/icon-calender.jpg" class="add-task-input-date-icon">
              </div>
            </div>
            <div class="add-task-info-element">
              <label for="taskPriority">Priority</label>
              <div id="taskPriority" class="add-task-priority-area">
                <img class="icon-add-task-priority-urgent pointer" id="1" onclick="setOverlayTaskPriority('1')">
                <img class="icon-add-task-priority-medium pointer" id="2" onclick="setOverlayTaskPriority('2')">
                <img class="icon-add-task-priority-low pointer" id="3" onclick="setOverlayTaskPriority('3')">
              </div>
            </div>
            <div class="add-task-info-element">
              <label for="taskAssignedTo">Assigned to <span>(optional)</span></label>
              <button type="button" class="add-task-assigned-to-button" onclick="toggleDropdown()">
                <p id="addTaskAssignedToValue">Select contacts to assign</p>
                <img class="icon-add-task-assigned-to-button-arrow">
              </button>
              <div id="taskAssignedToMenu" class="dropdown-menu">
                <!-- Dynamisch generierte Kontakte mit Checkboxen -->
              </div>
              <div class="dropdown-menu">
                <div class="dropdown-item active" id="dropdown-item">
                </div>
               </div>
            </div>
            <div id="taskMembers"></div>
            <div class="add-task-info-element">
              <label>Category</label>
              <button type="button" class="add-task-category-button" id="add-task-category-button" onclick="toggleCategoryDropdown()">
                <p id="addTaskCategoryValue">Select task category</p>
                <img class="icon-add-task-category-button-arrow">
              </button>
              <div id="categoryDropdown" class="dropdown-menu">
                <div class="dropdown-category-item" data-value="false" onclick="selectCategory(this)">Technical Task</div>
                <div class="dropdown-category-item" data-value="true" onclick="selectCategory(this)">User Story</div>
              </div>
            </div>
            <div class="add-task-info-element">
              <div class="add-task-info-element-header">Subtasks <span>(optional)</span></div>
              <div class="add-task-category-button">
                <input type="text" id="subtaskInput" placeholder="Add new subtask">
                <div class="ifSubtaskvalue" id="ifSubtaskvalue">
                  <button type="button" onclick="clearSubtask()" class="iconSubtask"><img src="../assets/icons/icon-cancel-active.png"></button>
                  <div class="subtaskDevider"></div>
                  <button type="button" onclick="addSubtask()" class="iconSubtask"><img src="../assets/icons/icon-check-active.png"></button>
                </div>
                <label for="subtaskInput" id="addSubtaskPlus"><img class="icon-add-subtask-button-plus"></label>
              </div>
              <ul id="taskAddSubtasksContent">
              </ul>
            </div>
            <div class="new-task-button-div"><button class="button-primary create-task-button" type="submit" ">Create Task<img src="../assets/icons/icon-whitecheck.svg" alt=""></button></div>
          </form>
    `;
  return newTaskOverlayHtml;
}