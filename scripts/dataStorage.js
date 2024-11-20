

function save() {
    let tasksSave = JSON.stringify(tasks);
    localStorage.setItem('tasks', tasksSave);
    console.log('save');
    
}


function load() {
    let tasksSave = localStorage.getItem('tasks');
    tasks = JSON.parse(tasksSave);
    console.log('load');
}

