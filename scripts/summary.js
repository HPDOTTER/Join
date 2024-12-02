const urgentTasks = document.getElementById('tasksUrgent');
const tasksAmount = document.getElementById('tasksAmount');
const tasksToDo = document.getElementById('tasksToDo');
const tasksInProgress = document.getElementById('tasksInProgress');
const tasksAwaitingFeedback = document.getElementById('tasksAwaitingFeedback');
const tasksDone = document.getElementById('tasksDone');
const welcomeName = document.getElementById('welcomeName');
const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

function onLoadSummary() {
    welcomeUser();
    waitForElement('#currentUserInitials', setCurrentUserInitials);
    updateSummaryBoard();
}

function welcomeUser() {
    welcomeName.innerHTML ='';
    if (user) {
        const userName = user.split(' ')[0];
        welcomeName.parentElement.innerHTML += `, <span id="welcomeName">${userName}</span>`;
    } else {
        return;
    }
}

function updateSummaryBoard() {
    tasksAmount.innerHTML = tasks.length;
}