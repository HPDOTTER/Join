const urgentTasks = document.getElementById('tasksUrgent');
const tasksAmount = document.getElementById('tasksAmount');
const tasksToDo = document.getElementById('tasksToDo');
const tasksInProgress = document.getElementById('tasksInProgress');
const tasksAwaitingFeedback = document.getElementById('tasksAwaitingFeedback');
const tasksDone = document.getElementById('tasksDone');
const welcomeName = document.getElementById('welcomeName');
const urgentDate = document.getElementById('urgentDate');

function onLoadSummary() {
    welcomeUser();
    updateSummaryBoard();
}

function welcomeUser() {
    welcomeName.innerHTML = '';
    if (user) {
        const userName = user.split(' ')[0];
        welcomeName.parentElement.innerHTML += `, <span id="welcomeName">${userName}</span>`;
    } else {
        return;
    }                                                                       
}

async function updateSummaryBoard() {
    await load();
    tasksAmount.innerHTML = tasks.length;
    tasksToDo.innerHTML = tasks.filter(task => task.status === 1).length;
    tasksInProgress.innerHTML = tasks.filter(task => task.status === 2).length;
    tasksAwaitingFeedback.innerHTML = tasks.filter(task => task.status === 3).length;
    tasksDone.innerHTML = tasks.filter(task => task.status === 4).length;
    urgentTasksFunction();
}

function urgentTasksFunction() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const urgentTasksList = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate < tomorrow && taskDate >= today;
    });
    urgentTasksList.sort((a, b) => new Date(a.date) - new Date(b.date));
    urgentTasks.innerHTML = urgentTasksList.length;
    if (urgentTasksList.length > 0) {
        displayUrgentTasksDate(urgentTasksList[0].date);
    }
}

function displayUrgentTasksDate(date) {
    const taskDate = new Date(date);
    const year = taskDate.getFullYear();
    const monthIndex = taskDate.getMonth(); // Months are zero-based
    const day = taskDate.getDate();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[monthIndex];
    const today = `${monthName} ${day < 10 ? '0' : ''}${day},  ${year}`;
    urgentDate.innerHTML = today;
}

