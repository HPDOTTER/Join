

let statusTask = 1;


function addTask(status) {
  load();
  statusTask = status;
  save();
  window.location.href = "./add-task.html";
}


function addTaskCancel() {
  window.location.href = "./board.html";
  renderTasks();
}


function addTaskSave() {
  load();
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const category = document.getElementById('taskCategory').value === 'true';
  const date = document.getElementById('taskDate').value;
  const priority = parseInt(document.getElementById('taskPriority').value);
  const member = document.getElementById('taskAssignedTo').value;

  let newTask = {
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

  if (member != '') {
    newTask = {
      titel: title,
      description: description,
      categoryUser: category,
      date: new Date(date),
      priority,
      status: statusTask,
      progress: 0,
      members: [getInitials(member)],
      subtasks: []
    };
  }


  tasks.push(newTask);
  window.location.href = "./board.html";
  save();
  renderTasks();
}


