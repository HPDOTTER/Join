const contactColors = [
  '#FF5733', // Leuchtendes Rot
  '#1D8348', // Waldgrün
  '#2980B9', // Sattes Blau
  '#FFC300', // Goldgelb
  '#512E5F', // Dunkelviolett
  '#C70039', // Dunkles Rot
  '#33FF57', // Sattes Grün
  '#1F618D', // Mittelmeerblau
  '#FF5EB3', // Pink
  '#6C3483', // Lila
  '#D35400', // Ziegelrot
  '#28B463', // Dunkles Grün
  '#154360', // Dunkelblau
  '#D4A373', // Warmes Beige
  '#581845', // Dunkles Lila
  '#A04000', // Rostbraun
  '#5d6e42', // Grau
  '#2874A6', // Stahblau
  '#A67C00', // Sattes Dunkelgelb
  '#884EA0', // Dunkler Lavendel
];


let activeContactItem = null;
let currentContact = null;

function showForm() {
  document.getElementById('contactForm').style.display = 'block';
  document.getElementById('contactFormOverlay').style.display = 'block';
  document.getElementById('contactListName').value = '';
  document.getElementById('contactListEmail').value = '';
  document.getElementById('contactListPhone').value = '';
}

function hideForm() {
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('contactFormOverlay').style.display = 'none';
}

function showDetail(contact, contactItem) {
  renderDetail(contact);
  showDetailActive(contact, contactItem);
}

function renderDetail(contact) {
  document.getElementById('contactDetailSection').style.display = 'block';
  document.getElementById('detailName').textContent = contact.name;
  document.getElementById('detailEmail').textContent = contact.email;
  document.getElementById('detailPhone').textContent = contact.phone;
  document.getElementById('contactAvatar').textContent = getInitials(contact.name);
  document.getElementById('contactAvatar').style.backgroundColor = contact.color;
}

function showDetailActive(contact, contactItem) {
  if (activeContactItem) {
    activeContactItem.classList.remove('active');
  }
  contactItem.classList.add('active');
  activeContactItem = contactItem;
  currentContact = contact;
}

function getInitials(name) {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

function hideDetail() {
  document.getElementById('contactDetailSection').style.display = 'none';
  if (activeContactItem) {
    activeContactItem.classList.remove('active');
    activeContactItem = null;
  }
  currentContact = null;
}

async function addContact() {
  const name = document.getElementById('contactListName').value.trim();
  const email = document.getElementById('contactListEmail').value.trim();
  const phone = document.getElementById('contactListPhone').value.trim();
  let colorNr = contactColors[0];
  if (contacts.length < contactColors.length) {
    colorNr = contactColors[contacts.length];
  } else if(contacts.length < (contactColors.length*2)) {
    colorNr = contactColors[contacts.length - contactColors.length];
  } else if(contacts.length < (contactColors.length*3)) {
    colorNr = contactColors[contacts.length - (contactColors.length*2)];
  }
  
  if (name && email && phone) {
    contacts.push({ name, email, phone, 'color' : colorNr });
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    await save();
    renderContacts();
    hideForm();
  } else {
    alert("Bitte füllen Sie alle Felder aus.");
  }
}

function editContact() {
  if (currentContact) {
    document.getElementById('contactEditForm').style.display = 'block';
    document.getElementById('contactEditOverlay').style.display = 'block';
    document.getElementById('editName').value = currentContact.name;
    document.getElementById('editEmail').value = currentContact.email;
    document.getElementById('editPhone').value = currentContact.phone;
    document.getElementById('contactEditAvatar').textContent = getInitials(currentContact.name);
    document.getElementById('contactEditAvatar').style.backgroundColor = currentContact.color;
  }
}

function saveContact() {
  if (currentContact) {
    currentContact.name = document.getElementById('editName').value.trim();
    currentContact.email = document.getElementById('editEmail').value.trim();
    currentContact.phone = document.getElementById('editPhone').value.trim();

    contacts.sort((a, b) => a.name.localeCompare(b.name));
    updateContactNames()
    renderDetail(currentContact);

    if (activeContactItem) {
      activeContactItem.classList.add('active');
    }

    hideEditForm();
  }
}

function cancelEdit() {
  hideEditForm();
}

function hideEditForm() {
  document.getElementById('contactEditForm').style.display = 'none';
  document.getElementById('contactEditOverlay').style.display = 'none';
  if (activeContactItem) {
    activeContactItem.classList.add('active');
  }
}

function cancelEdit() {
  hideEditForm();
}

async function deleteContact() {
  if (currentContact) {
    contacts = contacts.filter(contact => contact !== currentContact);
    cleanTaskMembers(tasks, contacts);
    await save();
    await renderContacts();
    hideDetail();
  }
}

function cleanTaskMembers(tasks, contacts) {
  const contactNames = contacts.map(contact => contact.name);
  tasks.forEach(task => {
      if (Array.isArray(task.members)) {
          task.members = task.members.filter(member => contactNames.includes(member));
      }
  });
}

async function renderContacts() {
  await load();
  const contactList = document.getElementById('contactList');
  contactList.innerHTML = '';

  const groupedContacts = {};

  contacts.forEach(contact => {
    const firstLetter = contact.name[0].toUpperCase();
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }
    groupedContacts[firstLetter].push(contact);
  });

  const sortedLetters = Object.keys(groupedContacts).sort();

  sortedLetters.forEach(letter => {
    const letterHeader = document.createElement('div');
    letterHeader.className = 'contact-list-letter-header';
    letterHeader.textContent = letter;
    contactList.appendChild(letterHeader);

    groupedContacts[letter].forEach(contact => {
      const contactItem = document.createElement('div');
      contactItem.className = 'contact-item pointer';
      contactItem.innerHTML = `<div class="contact-list-avatar" style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
                               <div>
                                 <span class="contact-list-name">${contact.name}</span><br>
                                 <span class="contact-email">${contact.email}<span>
                               </div>`;
      contactItem.onclick = () => showDetail(contact, contactItem);
      contactList.appendChild(contactItem);
    });
  });
}

function updateContactNames() {
  const contactList = document.getElementById('contactList');
  const contactItems = contactList.getElementsByClassName('contact-item');
  Array.from(contactItems).forEach((contactItem, index) => {
    const contact = contacts[index];
    const nameElement = contactItem.querySelector('.contact-list-name');
    const emailElement = contactItem.querySelector('.contact-email');
    const phoneElement = contactItem.querySelector('.contact-phone');
    if (nameElement) {
      nameElement.textContent = contact.name;
    }
    if (emailElement) {
      emailElement.textContent = contact.email;
    }
    if (phoneElement) {
      phoneElement.textContent = contact.phone;
    }
  });
}


// document.addEventListener('DOMContentLoaded', hideDetail);

