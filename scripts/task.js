let filteredTasks = []; // Array zum Speichern gefilterter Tasks

async function renderTasks() {
  await load();
  const columns = document.querySelectorAll('.column .tasks');
  const noTasksMessage = document.getElementById('noTasksMessage');
  // noTasksMessage.style.display = 'none';
  columns.forEach(column => (column.innerHTML = ''));
  console.log(filteredTasks.length ? filteredTasks : tasks, 'render');

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

