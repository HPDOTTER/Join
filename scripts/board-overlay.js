const overlay = document.getElementById('taskOverlay');

function openTaskOverlay(index) {
    const task = tasks[index];
    overlay.innerHTML = getOpenTaskOverlayTemplate(task, index);
    showOverlay();
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    if (overlay) {
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
          const taskOverlayContent = document.getElementById('task-overlay-content');
          hideOverlay(taskOverlayContent);
        }
      });
    }
  });



function showOverlay() {
    overlay.classList.add('show');
  }
  
function hideOverlay(taskOverlayContent) {
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






const editOverlay = document.getElementById('editTaskOverlay');

function openEditTaskOverlay(task, index) {
  editOverlay.innerHTML = getEditTaskOverlayTemplate(task, index);
  showEditOverlay();
}

function getEditTaskOverlayTemplate(task, index) {
  return `
    <div class="task-overlay-content">
    `
}

document.addEventListener('DOMContentLoaded', () => {
  if (editOverlay) {
    editOverlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        hideEditOverlay();
      }
    });
  }
});

function showEditOverlay() {
  editOverlay.style.display = 'inline-block';
  overlay.style.display = 'none';
}

function hideEditOverlay() {
    editOverlay.style.display = 'none';
    overlay.style.display = 'inline-block';
}
