/**
 * References to DOM elements used in the summary board and user greeting.
 */
const urgentTasks = document.getElementById('tasksUrgent');
const tasksAmount = document.getElementById('tasksAmount');
const tasksToDo = document.getElementById('tasksToDo');
const tasksInProgress = document.getElementById('tasksInProgress');
const tasksAwaitingFeedback = document.getElementById('tasksAwaitingFeedback');
const tasksDone = document.getElementById('tasksDone');
const welcomeName = document.getElementById('welcomeName');
const summaryWelcomeText = document.getElementById('summaryWelcomeText');
const urgentDate = document.getElementById('urgentDate');

/**
 * Initializes the summary board and user greeting on page load.
 */
function onLoadSummary() {
    welcomeUser();
    updateSummaryBoard();
}

/**
 * Displays a personalized greeting to the user based on the current time of day.
 */
function welcomeUser() {
    const greetingFormula = getGreetingFormula();
    if (user) {
        const userName = user.split(' ')[0];
        summaryWelcomeText.innerHTML = `${greetingFormula}, <span id="welcomeName">${userName}</span>`;
    } else {
        summaryWelcomeText.innerHTML = greetingFormula;
    }                                                                        
}

/**
 * Determines the appropriate greeting based on the current time of day.
 * 
 * @returns {string} A greeting string such as "Good morning", "Good afternoon", or "Good evening".
 */
function getGreetingFormula() {
    const now = new Date();
    const hours = now.getHours();
    let greetingFormula = '';
    if (hours >= 18) {
        greetingFormula = 'Good evening';
    } else if (hours >= 12) {
        greetingFormula = 'Good afternoon';
    } else if (hours >= 5) {
        greetingFormula = 'Good morning';
    } else {
        greetingFormula = 'Hello';
    }
    return greetingFormula;
}

/**
 * Updates the summary board with task statistics and urgent task information.
 * 
 * @async
 */
async function updateSummaryBoard() {
    await load();
    tasksAmount.innerHTML = tasks.length;
    tasksToDo.innerHTML = tasks.filter(task => task.status === 1).length;
    tasksInProgress.innerHTML = tasks.filter(task => task.status === 2).length;
    tasksAwaitingFeedback.innerHTML = tasks.filter(task => task.status === 3).length;
    tasksDone.innerHTML = tasks.filter(task => task.status === 4).length;
    urgentTasksFunction();
}

/**
 * Identifies and displays the number of urgent tasks, as well as their nearest due date.
 */
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

/**
 * Displays the due date of the most urgent task in a user-friendly format.
 * 
 * @param {string} date - The due date of the most urgent task in ISO format.
 */
function displayUrgentTasksDate(date) {
    const taskDate = new Date(date);
    const year = taskDate.getFullYear();
    const monthIndex = taskDate.getMonth();
    const day = taskDate.getDate();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[monthIndex];
    const today = `${monthName} ${day < 10 ? '0' : ''}${day},  ${year}`;
    urgentDate.innerHTML = today;
}
