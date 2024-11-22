

let statusTask = 1;
let members = [];


function addTask(status) {
  load();
  statusTask = status;
  save();
  window.location.href = "../html/add-task.html";
}


function addTaskCancel() {
  window.location.href = "../html/board.html";
  renderTasks();
}


function addTaskSave() {
  load();
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const category = document.getElementById('taskCategory').value === 'true';
  const date = document.getElementById('taskDate').value;
  const priority = parseInt(document.getElementById('taskPriority').value);

  let newTask = {
    titel: title,
    description: description,
    categoryUser: category,
    date: new Date(date),
    priority,
    status: statusTask,
    progress: 0,
    members: members,
    subtasks: []
  };

  tasks.push(newTask);
  window.location.href = "../html/board.html";
  save();
  renderTasks();
}


const toggleDropdown = () => {
    const dropdownMenu = document.getElementById("taskAssignedToMenu");
    dropdownMenu.classList.toggle("active");
  };
  
  const renderContactsWithCheckboxes = () => {
    const dropdownMenu = document.getElementById("taskAssignedToMenu");
  
    contacts.forEach((contact, index) => {
      const item = document.createElement("div");
      item.className = "contact-item";
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "contact-checkbox";
      checkbox.id = `contact-${index}`;
      checkbox.checked = false; //tasks[0].members.includes(contact.name); // Vorab ausgewählte Kontakte
      checkbox.addEventListener("change", (event) => handleCheckboxChange(event, contact));
  
      const label = document.createElement("label");
      label.setAttribute("for", `contact-${index}`);
      label.textContent = contact.name;
  
      item.appendChild(checkbox);
      item.appendChild(label);
      dropdownMenu.appendChild(item);
    });
  };
  

  const handleCheckboxChange = (event, contact) => {
    if (event.target.checked) {
      if (!members.includes(contact.name)) {
        members.push(contact.name);
      }
    } else {
      members = members.filter((member) => member !== contact.name);
    }
  };
  
  
  // Initialisierung
  document.addEventListener("DOMContentLoaded", renderContactsWithCheckboxes);

