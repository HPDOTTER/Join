let tasks = [
  {
    'titel': 'Kochwelt Page & Recipe Recommender',
    'description': 'Build start page with recipe recommendation',
    'categoryUser': true,
    'date': new Date(2024, 10, 29),
    'priority': 1,
    'status': 2,
    'progress': 0,
    'members': ['Jutta Berger', 'Anna Horn'],
    'subtasks': [
      { 'subtitel': 'Design UI', 'isDone': false },
      { 'subtitel': 'function b', 'isDone': true }
    ]
  },
  {
    'titel': 'CSS Architecture Planning',
    'description': 'Define CSS naming conventions and structure',
    'categoryUser': false,
    'date': new Date(2024, 10, 28),
    'priority': 3,
    'status': 4,
    'progress': 0,
    'members': ['Josef Müller', 'Anton Sippel', 'Saul Goodman'],
    'subtasks': [
      { 'subtitel': 'menue design', 'isDone': true },
      { 'subtitel': 'function a', 'isDone': true }
    ]
  }
];

let currentDraggedElement;

function renderTasks() {
  load();
  const columns = document.querySelectorAll('.column .tasks');
  columns.forEach(column => (column.innerHTML = ''));

  tasks.forEach((task, index) => {
    const taskElement = document.createElement('div');
    let subtaskCount = 0;
    let subtaskDone = 0;
    subtaskCount = task.subtasks.length;
    task.subtasks.forEach(element => {
      if (element.isDone == true) {
        subtaskDone += 1;
      }
    });
    task.progress = subtaskDone / subtaskCount;
    
    taskElement.classList.add('task');
    taskElement.setAttribute('draggable', 'true');
    taskElement.setAttribute('ondragstart', `startDrag(${index})`);
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
        html += /*html*/`<div class="contactAvatar">${getInitials(task.members[i])}</div>`;
      }
    }
    html += /*html*/`</div>`;
    if (task.priority == 1) {
      html += /*html*/`<div class="prio13 priodiv"><img src="../assets/img/prio1.png" alt=""></div>`
    } else if (task.priority == 2) {
      html += /*html*/`<div class="prio2 priodiv"><img src="../assets/img/prio2.png" alt=""></div>`
    } else if (task.priority == 3) {
      html += /*html*/`<div class="prio13 priodiv"><img src="../assets/img/prio3.png" alt=""></div>`
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
  console.log(tasks);
}

function startDrag(index) {
  currentDraggedElement = index;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(status) {
  tasks[currentDraggedElement]['status'] = status;
  save();
  renderTasks();
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