const overlay = document.getElementById('taskOverlay');
let currentTask = null;

function openTaskOverlay(index) {
    const task = tasks[index];
    overlay.innerHTML = getOpenTaskOverlayTemplate(task, index);
    showOverlay();
    currentTask = index;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    if (overlay) {
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
          hideOverlay();
        }
      });
    }
  });



function showOverlay() {
    overlay.classList.add('show');
  }
  
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

async function deleteTask(index) {
    tasks.splice(index, 1);
    await save();
    await renderTasks();
    hideOverlay();
  }

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
  
function overlaySubTasks(task, taskIndex) {
    return task.subtasks.map((subtask, subtaskIndex) => {
      const checkboxId = `subtask-${taskIndex}-${subtaskIndex}`;
      return getOverlaySubtaskHtml(subtask, taskIndex, subtaskIndex, checkboxId);
    }).join('');
  }
  
async function overlaySubtaskCheckbox(taskIndex, subtaskIndex) {
    const task = tasks[taskIndex];
    const subtask = task.subtasks[subtaskIndex];
    const checkboxId = `subtask-${taskIndex}-${subtaskIndex}`;
    if (subtask.isDone) {
      subtask.isDone = false;
      document.getElementById(checkboxId).checked = false;
    } else {
      subtask.isDone = true;
      document.getElementById(checkboxId).checked = true;
    }
    await save();
    await renderTasks(); 
  }

function taskPriority(task) {
    if (task.priority) {
      if (task.priority == 1) {
        return `<div class="overlay-priority-div"> <b>Priority:</b> <p>Urgent</p> <div class="prio13 priodiv"><img src="../assets/img/prioUrgent.svg"></div></div>`
      } else if (task.priority == 2) {
        return `<div class="overlay-priority-div"> <b>Priority:</b> <p>Medium</p> <div class="prio13 priodiv"><img src="../assets/img/prioMedium.svg"></div></div>`
      } else if (task.priority == 3) {
        return `<div class="overlay-priority-div"> <b>Priority:</b> <p>Low</p> <div class="prio13 priodiv"><img src="../assets/img/prioLow.svg"></div></div>`
      }
    } else {
      return '';
    }
  }



function openEditTaskOverlay(index) {
  const etask = tasks[index];
  overlay.innerHTML = getEditTaskOverlayTemplate(index, etask);
  renderContactsWithCheckboxes();
  taskMembers(etask.members); // Call taskMembers after the element is added to the DOM
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function taskCategory(etask) {
  return etask.categoryUser ? 'User Story' : 'Technical Task';
}

function getEditTaskOverlayTemplate(index, etask) {
  const formattedDates = formatDate(etask.date);
  const taskMembersHtml = `
    <div class="task-overlay-content" id="task-overlay-content">
      <div class="task-overlay-head">
        <div></div>
        <div>
          <img src="../assets/icons/close.svg" class="close-overlay" onclick="hideOverlay()">
        </div>
      </div>
      <div id="taskAdd" class="add-task-area">
        <div class="add-task-info-element">
          <div class="input-wrapper">
            <input type="text" class="input add-task-input-title" id="editTaskTitle" value="${etask.titel}">
          </div>
        </div>

        <div class="add-task-info-element">
          <label for="taskDescription">Description</label>
          <textarea id="editTaskDescription" class="add-task-textarea">${etask.description}</textarea>
          <div class="custom-resize-handle"></div>
        </div>

        <div class="add-task-info-element">
          <label for="taskDate">Due date</label>
          <div class="input-wrapper">
            <input type="date" placeholder="dd/mm/yyyy" class="input" id="editTaskDate" value="${formattedDates}">
            <img src="../assets/icons/icon-calender.jpg" class="add-task-input-date-icon">
          </div>
        </div>

        <div class="add-task-info-element">
          <label for="taskPriority">Priority</label>
          <div id="editTaskPriority" class="add-task-priority-area">
            <img class="icon-add-task-priority-urgent pointer" id="1" onclick="taskPriority('1')">
            <img class="icon-add-task-priority-medium pointer" id="2" onclick="taskPriority('2')">
            <img class="icon-add-task-priority-low pointer" id="3" onclick="taskPriority('3')">
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
          <label>Category</label>
          <button class="add-task-category-button" id="add-task-category-button" onclick="toggleCategoryDropdown()">
            <p id="addTaskCategoryValue">${taskCategory(etask)}</p>
            <img class="icon-add-task-category-button-arrow">
          </button>
          <div id="categoryDropdown" class="dropdown-menu">
            <div class="dropdown-category-item" data-value="false" onclick="selectCategory(this)">Technical Task</div>
            <div class="dropdown-category-item" data-value="true" onclick="selectCategory(this)">User Story</div>
          </div>
        </div>

        <div class="add-task-info-element">
          <div class="add-task-info-element-header">Subtasks</span></div>
          <div class="add-task-category-button">
            <input type="text" id="subtaskInput" placeholder="Add new subtask">
            <div class="ifSubtaskvalue" id="ifSubtaskvalue">
              <button onclick="clearSubtask()" class="clearSubtask"><img src="../assets/icons/close.svg"></button>
              <div class="subtaskDevider"></div>
              <button onclick="addSubtask()" class="addSubtask"><img src="../assets/icons/icon-check-active.png"></button>
            </div>
            <label for="subtaskInput" id="addSubtaskPlus"><img class="icon-add-subtask-button-plus"></label>
          </div>
          <ul id="taskAddSubtasksContent">
          </ul>
        </div>

      </div>
      <span class="overlay-edit-footer">
        <button class="button-primary" onclick="editTask(${index})">Done</button>
      </span>
    </div>
  `;
  return taskMembersHtml;
}
