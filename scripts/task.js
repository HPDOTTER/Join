let filteredTasks = []; // Array zum Speichern gefilterter Tasks

async function renderTasks() {
  await load();
  const columns = document.querySelectorAll('.column .tasks');
  const noTasksMessage = document.getElementById('noTasksMessage');
  // noTasksMessage.style.display = 'none';
  columns.forEach(column => (column.innerHTML = ''));

  // Entscheide, ob die Original-Tasks oder gefilterte Tasks gerendert werden sollen
  const tasksToRender = filteredTasks.length ? filteredTasks : tasks;

  tasksToRender.forEach((task, index) => {
    const taskElement = document.createElement('div');
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

    taskElement.classList.add('task');
    taskElement.setAttribute('draggable', 'true');
    taskElement.setAttribute('ondragstart', `startDrag(${index})`);
    taskElement.setAttribute('onclick', `openTaskOverlay(${index})`);
    taskElement.innerHTML = `
      <span class="category ${task.categoryUser ? 'user' : 'technical'}">
        ${task.categoryUser ? 'User Story' : 'Technical Task'}
      </span>

      <h3>${task.titel}</h3>
      <p>${task.description}</p>
      
      <section class="progress-section">
        <div class="progress-bar">
          <div class="progress" style="width: ${task.progress * 100}%;"></div>
        </div>
        <div>${subtaskDone}/${subtaskCount} Subtasks</div>
      </section>
    `;

    let html = /*html*/`<section class="members-prio">`;
    html += /*html*/`<div class="avatar">`;
    if (task.members) {
      for (let i = 0; i < task.members.length; i++) {
        const member = task.members[i];

        // Finde den Kontakt im "contacts"-Array und hole die Farbe
        const contact = contacts.find(contact => contact.name === member);
        const avatarColor = contact ? contact.color : 'orange'; // Falls keine Farbe gefunden, Standardfarbe orange

        html += /*html*/`<div class="contactAvatar" style="background-color: ${avatarColor}">${getInitials(member)}</div>`;
      }
    }
    html += /*html*/`</div>`;
    if (task.priority == 1) {
      html += /*html*/`<div class="prio13 priodiv"><img src="../assets/img/prioUrgent.svg" alt=""></div>`
    } else if (task.priority == 2) {
      html += /*html*/`<div class="prio2 priodiv"><img src="../assets/img/prioMedium.svg" alt=""></div>`
    } else if (task.priority == 3) {
      html += /*html*/`<div class="prio13 priodiv"><img src="../assets/img/prioLow.svg" alt=""></div>`
    }
    html += /*html*/`</section>`;
    taskElement.innerHTML += html;

    const column = document.querySelector(`.column[data-status="${task.status}"] .tasks`);
    if (column) {
      column.appendChild(taskElement);
    } else {
      console.error(`No column found for status ${task.status}`);
    }
  });
  showDummydiv();
}

function openTaskOverlay(index) {
  const task = tasks[index];
  const overlay = document.getElementById('taskOverlay');
  overlay.innerHTML = getOpenTaskOverlayTemplate(task, index);
  showOverlay();
}

async function deleteTask(index) {
  tasks.splice(index, 1);
  await save();
  await renderTasks();
  hideOverlay();
}

function taskTitle(task) {
  if (task.titel) {
    return `<h1>${task.titel}</h1>`;
  } else {
    return '';
  }
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

function taskAssignedTo(task) {
  return task.members.map(member => {
    const contact = contacts.find(contact => contact.name === member);
    const avatarColor = contact ? contact.color : 'orange';
    return getTaskAssignedToTemplate(member, avatarColor);
  }).join('');
}

function renderMembers(task) {
  if (task.members && task.members.length > 0) {
    return task.members.map(member => {
      const contact = contacts.find(contact => contact.name === member);
      const avatarColor = contact ? contact.color : 'orange';
      return `<div class="contactAvatar" style="background-color: ${avatarColor}">${getInitials(member)}</div>`;
    }).join('');
  }   
  return '';
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

function taskDescription(task) {
  if (task.description) {
    return `<p>${task.description}</p>`;
  } else {
    return '';
  }
}

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

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('taskOverlay');
  if (overlay) {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        hideOverlay();
      }
    });
  }
});

function showOverlay() {
    const overlay = document.getElementById('taskOverlay');
    overlay.classList.add('show');
}

function hideOverlay() {
    const overlay = document.getElementById('taskOverlay');
    overlay.classList.remove('show');
}

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

function startDrag(index) {
  currentDraggedElement = index;
  const taskElement = document.querySelector(`.task[ondragstart="startDrag(${index})"]`);
  taskElement.classList.add('dragging');
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(status) {
  tasks[currentDraggedElement]['status'] = status;
  await save();
  await renderTasks();
  removeHighlight(status);
}

function highlight(status) {
  const column = document.querySelector(`.column[data-status="${status}"]`);
  column.classList.add('highlight');
}

function removeHighlight(status) {
  const column = document.querySelector(`.column[data-status="${status}"]`);
  column.classList.remove('highlight');
}

const dummyMessages = [
  'No tasks to do',
  'No tasks in progress',
  'No tasks awaiting Feedback',
  'No tasks done'
];

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


