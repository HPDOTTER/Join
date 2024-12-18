let filteredTasks = []; // Array zum Speichern gefilterter Tasks
const noTasksMessage = document.getElementById('noTasksMessage');

async function renderTasks() {
  await load();
  const columns = document.querySelectorAll('.column .tasks');
  columns.forEach(column => (column.innerHTML = ''));
  tasksCurrentlyRendering(tasks);
}

function tasksCurrentlyRendering(tasks) {
  const tasksToRender = filteredTasks.length ? filteredTasks : tasks;
  tasksToRender.forEach((task, index) => {
    taskTemplate(task, index);
    const column = document.querySelector(`.column[data-status="${task.status}"] .tasks`);
    column.innerHTML += taskTemplate(task, index);
  });
  showDummydiv();
}

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

function renderMembersPrio(task) {
  let html = `<section class="members-prio"><div class="avatar">`;
  html += renderMembers(task);
  html += `</div>${setTaskPriority(task, '')}</section>`;
  return html;
}

function renderMembers(task) {
  return task.members && task.members.length > 0
    ? task.members.map(member => {
      const contact = contacts.find(contact => contact.name === member);
      const avatarColor = contact ? contact.color : 'orange';
      return `<div class="contactAvatar" style="background-color: ${avatarColor}">${getInitials(member)}</div>`;
    }).join('')
    : '';
}

function setTaskPriority(task, html) {
  if (task.priority == 1) {
    html += `<div class="prio13 priodiv"><img src="../assets/img/prioUrgent.svg" alt=""></div>`
  } else if (task.priority == 2) {
    html += `<div class="prio2 priodiv"><img src="../assets/img/prioMedium.svg" alt=""></div>`
  } else if (task.priority == 3) {
    html += `<div class="prio13 priodiv"><img src="../assets/img/prioLow.svg" alt=""></div>`
  }
  return html;
}

function taskTitle(task) {
  if (task.titel) {
    return `<h1>${task.titel}</h1>`;
  } else {
    return '';
  }
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

function taskDescription(task) {
  if (task.description) {
    return `<p class="taskDescriptionBoard">${task.description}</p>`;
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

// function startTouchDrag(e, index) {
//   console.log(e);
//   console.log(index);
//   let startX = e.changedTouches[0].clientX;
//   let startY = e.changedTouches[0].clientY;
//   currentDraggedElement = document.querySelector(`.task[ontouchstart="startTouchDrag(event, ${index})"]`);
//   // console.log(currentDraggedTask);

//   currentDraggedElement.addEventListener("touchmove", eve=>{
//     let nextX = eve.changedTouches[0].clientX;
//     let nextY = eve.changedTouches[0].clientY;
//     currentDraggedElement.style.left = nextX - startX + "px";
//     currentDraggedElement.style.top = nextY - startY + "px";
//   });
// }

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
  const column = document.querySelector(`.column[data-status="${status}"] .tasks`);
  column.classList.add('highlight');
}

function removeHighlight(status) {
  const column = document.querySelector(`.column[data-status="${status}"] .tasks`);
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

function toggleTaskStatusSelectionMenu(event, index) {
  let menu = document.getElementById(`taskStatusSelectionMenu${index}`);
  menu.classList.toggle('d-none');
  event.stopPropagation();
}

async function setTaskStatus(event, taskStatus, index) {
  toggleTaskStatusSelectionMenu(event, index);
  tasks[index]['status'] = taskStatus;
  await save();
  await renderTasks();
}
