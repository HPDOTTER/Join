

function save() {
    let tasksSave = JSON.stringify(tasks);
    let statusTaskSave = JSON.stringify(statusTask);
    localStorage.setItem('tasks', tasksSave);
    localStorage.setItem('statusTask', statusTaskSave);
}


function load() {
    let tasksSave = localStorage.getItem('tasks');
    let statusTaskSave = localStorage.getItem('statusTask');
    tasks = JSON.parse(tasksSave);
    statusTask = JSON.parse(statusTaskSave);
}

