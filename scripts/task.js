let tasks = [
  {
    'titel': 'Kochwelt Page & Recipe Recommender',
    'description': 'Build start page with recipe recommendation',
    'categoryUser': true,
    'date': new Date(2024, 10, 29),
    'priority': 1,
    'status': 2,
    'progress': 0,
    'members': ['AM', 'EM', 'MB'],
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
    'members': ['SN', 'BZ'],
    'subtasks': [
      { 'subtitel': 'menue design', 'isDone': true },
      { 'subtitel': 'function a', 'isDone': true }
    ]
  }
];


let statusTask = 1;


function openModal(status) {
  statusTask = status;
  document.getElementById('taskModal').classList.remove('hidden');
  document.getElementById('taskModal').classList.add('flex');
}


function closeModal() {
  document.getElementById('taskModal').classList.remove('flex');
  document.getElementById('taskModal').classList.add('hidden');
}


function saveTask() {
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const category = document.getElementById('taskCategory').value === 'true';
  const date = document.getElementById('taskDate').value;
  const priority = parseInt(document.getElementById('taskPriority').value);

  const newTask = {
    titel: title,
    description: description,
    categoryUser: category,
    date: new Date(date),
    priority,
    status: statusTask,
    progress: 0,
    members: [],
    subtasks: []
  };

  tasks.push(newTask);
  document.getElementById('taskModal').classList.remove('flex');
  document.getElementById('taskModal').classList.add('hidden');
  renderTasks();
}


function renderTasks() {
  const columns = document.querySelectorAll('.column .tasks');
  columns.forEach(column => (column.innerHTML = ''));

  tasks.forEach(task => {
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
        html += /*html*/`<div class="contactAvatar">${task.members[i]}</div>`;
      }
    }
    html += /*html*/`</div>`;
    if (task.priority == 1) {
      html += /*html*/`<div class="prio13"><img src="./assets/img/prio1.png" alt=""></div>`
    } else if (task.priority == 2) {
      html += /*html*/`<div class="prio2"><img src="./assets/img/prio2.png" alt=""></div>`
    } else if (task.priority == 3) {
      html += /*html*/`<div class="prio13"><img src="./assets/img/prio3.png" alt=""></div>`
    }
    html += /*html*/`</section>`;
    taskElement.innerHTML += html;

    const column = document.querySelector(`.column[data-status="${task.status}"] .tasks`);
    column.appendChild(taskElement);
  });
}


renderTasks();