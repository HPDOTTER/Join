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

