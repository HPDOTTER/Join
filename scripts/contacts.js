const contactColors = [
  '#FF7A00;', // Orange
  '#FF5EB3', // Pink
  '#6E52FF', // Violet
  '#9327FF', // Purple
  '#00BEE8', // Turquoise
  '#1FD7C1', // Aqua
  '#FF745E', // Salmon
  '#FFA35E', // Pastel Orange
  '#FC71FF', // Fuchsia
  '#FFC701', // Pastelgold
  '#0038FF', // Blue
  '#C3FF2B', // Lime
  '#FFE62B', // Yellow
  '#FF4646', // Coral
  'FFBB2B', // Gold
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
  let colorNr = contactColors[Math.floor(Math.random() * 14)];

  if (name && email && phone) {
    contacts.push({ name, email, phone, 'color': colorNr });
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    await save();
    renderContacts();
    hideForm();
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
    cleanTaskMembers(tasks, contacts);
    updateContactNames();
    renderDetail(currentContact);

    if (activeContactItem) {
      activeContactItem.classList.add('active');
    }
    save();
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
  const groupedContacts = groupContactsByFirstLetter(contacts);
  Object.keys(groupedContacts).sort().forEach(letter => {
    contactList.appendChild(createLetterHeader(letter));
    groupedContacts[letter].forEach(contact => {
      contactList.appendChild(createContactItem(contact));
    });
  });
}

function groupContactsByFirstLetter(contacts) {
  return contacts.reduce((groups, contact) => {
    const letter = contact.name[0].toUpperCase();
    groups[letter] = groups[letter] || [];
    groups[letter].push(contact);
    return groups;
  }, {});
}

function createLetterHeader(letter) {
  const header = document.createElement('div');
  header.className = 'contact-list-letter-header';
  header.textContent = letter;
  return header;
}

function createContactItem(contact) {
  const item = document.createElement('div');
  item.className = 'contact-item pointer';
  item.innerHTML = `<div class="contact-list-avatar" style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
                    <div>
                      <span class="contact-list-name">${contact.name}</span><br>
                      <span class="contact-email">${contact.email}</span>
                    </div>`;
  item.onclick = () => showDetail(contact, item);
  return item;
}

function updateContactNames() {
  const contactItems = document.querySelectorAll('#contactList .contact-item');
  contactItems.forEach((contactItem, index) => {
    const contact = contacts[index];
    contactItem.querySelector('.contact-list-name').textContent = contact.name;
    contactItem.querySelector('.contact-email').textContent = contact.email;
    const phoneElement = contactItem.querySelector('.contact-phone');
    if (phoneElement) phoneElement.textContent = contact.phone;
  });
}

function toggleResponsiveMenu(){
  let menu = document.getElementById('contactDetailResponsiveMenu');
  menu.classList.toggle('d-none');
}


// document.addEventListener('DOMContentLoaded', hideDetail);

