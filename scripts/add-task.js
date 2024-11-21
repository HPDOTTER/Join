

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
//   const member = document.getElementById('taskAssignedTo').value;

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

//   if (member != '') {
//     newTask = {
//       titel: title,
//       description: description,
//       categoryUser: category,
//       date: new Date(date),
//       priority,
//       status: statusTask,
//       progress: 0,
//       members: [],//[getInitials(member)],
//       subtasks: []
//     };
//   }


  tasks.push(newTask);
  window.location.href = "./board.html";
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
      checkbox.checked = tasks[0].members.includes(contact.name); // Vorab ausgewählte Kontakte
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
    const task = tasks[0]; // Beispielhaft die erste Aufgabe
  
    if (event.target.checked) {
      // Kontakt hinzufügen
      if (!task.members.includes(contact.name)) {
        task.members.push(contact.name);
      }
    } else {
      // Kontakt entfernen
      task.members = task.members.filter((member) => member !== contact.name);
    }
  
    console.log("Aktualisierte Mitglieder:", task.members);
  };
  
  // Initialisierung
  document.addEventListener("DOMContentLoaded", renderContactsWithCheckboxes);