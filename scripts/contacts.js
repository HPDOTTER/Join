/**
 * Array of predefined contact colors.
 * @type {string[]}
 */
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

/**
 * The currently active contact item element.
 * @type {HTMLElement|null}
 */
let activeContactItem = null;

/**
 * The currently selected contact object.
 * @type {Object|null}
 */
let currentContact = null;

/**
 * Displays the contact form for adding a new contact.
 */
function showForm() {
  document.getElementById('contactForm').style.display = 'block';
  document.getElementById('contactFormOverlay').style.display = 'block';
  document.getElementById('contactListName').value = '';
  document.getElementById('contactListEmail').value = '';
  document.getElementById('contactListPhone').value = '';
}

/**
 * Hides the contact form.
 */
function hideForm() {
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('contactFormOverlay').style.display = 'none';
}

/**
 * Displays the details of a contact.
 * @param {Object} contact - The contact object to display.
 * @param {HTMLElement} contactItem - The corresponding contact list item element.
 */
function showDetail(contact, contactItem) {
  renderDetail(contact);
  showDetailActive(contact, contactItem);
}

/**
 * Renders the details of a contact in the detail section.
 * @param {Object} contact - The contact object to render.
 */
function renderDetail(contact) {
  document.getElementById('contactDetailSection').style.display = 'block';
  document.getElementById('detailName').textContent = contact.name;
  document.getElementById('detailEmail').textContent = contact.email;
  document.getElementById('detailPhone').textContent = contact.phone;
  document.getElementById('contactAvatar').textContent = getInitials(contact.name);
  document.getElementById('contactAvatar').style.backgroundColor = contact.color;
}

/**
 * Marks the clicked contact as active and highlights it.
 * @param {Object} contact - The contact object.
 * @param {HTMLElement} contactItem - The corresponding contact list item element.
 */
function showDetailActive(contact, contactItem) {
  if (activeContactItem) {
    activeContactItem.classList.remove('activeC');
  }
  contactItem.classList.add('activeC');
  activeContactItem = contactItem;
  currentContact = contact;
}

/**
 * Hides the contact details section.
 */
function hideDetail() {
  document.getElementById('contactDetailSection').style.display = 'none';
  if (activeContactItem) {
    activeContactItem.classList.remove('activeC');
    activeContactItem = null;
  }
  currentContact = null;
}

/**
 * Adds a new contact and updates the contact list.
 * @returns {Promise<void>}
 */
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

/**
 * Opens the edit form with the current contact's details.
 */
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

/**
 * Saves the changes made to the current contact.
 */
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
      activeContactItem.classList.add('activeC');
    }
    save();
    hideEditForm();
  }
}

/**
 * Cancels the editing process and hides the edit form.
 */
function cancelEdit() {
  hideEditForm();
}

/**
 * Hides the edit contact form.
 */
function hideEditForm() {
  document.getElementById('contactEditForm').style.display = 'none';
  document.getElementById('contactEditOverlay').style.display = 'none';
  if (activeContactItem) {
    activeContactItem.classList.add('activeC');
  }
}

/**
 * Deletes the current contact and updates the contact list.
 * @returns {Promise<void>}
 */
async function deleteContact() {
  if (currentContact) {
    contacts = contacts.filter(contact => contact !== currentContact);
    cleanTaskMembers(tasks, contacts);
    if (currentContact.user) {
      cleanUserMembers(currentContact);
      logout();
    }
    await save();
    await renderContacts();
    hideDetail();
  }
}

/**
 * Cleans up task members by removing deleted contacts from tasks.
 * @param {Object[]} tasks - The array of tasks.
 * @param {Object[]} contacts - The array of remaining contacts.
 */
function cleanTaskMembers(tasks, contacts) {
  const contactNames = contacts.map(contact => contact.name);
  tasks.forEach(task => {
    if (Array.isArray(task.members)) {
      task.members = task.members.filter(member => contactNames.includes(member));
    }
  });
}

/**
 * Removes deleted contacts from the user list.
 * @param {Object} currentContact - The contact to remove from users.
 */
function cleanUserMembers(currentContact) {
  users = users.filter(users => users.name !== currentContact.name);
}

/**
 * Renders the contact list grouped by first letters.
 * @returns {Promise<void>}
 */
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

/**
 * Groups contacts by their first letter.
 * @param {Object[]} contacts - The array of contacts.
 * @returns {Object} An object grouping contacts by their first letter.
 */
function groupContactsByFirstLetter(contacts) {
  return contacts.reduce((groups, contact) => {
    const letter = contact.name[0].toUpperCase();
    groups[letter] = groups[letter] || [];
    groups[letter].push(contact);
    return groups;
  }, {});
}

/**
 * Creates a letter header for the contact list.
 * @param {string} letter - The letter to create the header for.
 * @returns {HTMLElement} The letter header element.
 */
function createLetterHeader(letter) {
  const header = document.createElement('div');
  header.className = 'contact-list-letter-header';
  header.textContent = letter;
  return header;
}

/**
 * Creates a contact item element.
 * @param {Object} contact - The contact object to create an item for.
 * @returns {HTMLElement} The contact item element.
 */
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

/**
 * Updates the names and details of the contacts in the contact list.
 */
function updateContactNames() {
  const contactItems = document.querySelectorAll('#contactList .contact-item');
  contactItems.forEach((contactItem, index) => {
    const contact = contacts[index];
    contactItem.querySelector('.contact-list-name').textContent = contact.name;
    contactItem.querySelector('.contact-email').textContent = contact.email;
    const phoneElement = contactItem.querySelector('.contact-phone');
    if (phoneElement) phoneElement.textContent = contact.phone;
    if (contact.user === true) {
      const user = users.find(u => u.name === contact.name);
      if (user) {
        user.email = contact.email;
      }
    }
  });
}

/**
 * Toggles the responsive menu visibility in the contact detail section.
 */
function toggleResponsiveMenu() {
  let menu = document.getElementById('contactDetailResponsiveMenu');
  menu.classList.toggle('d-none');
}
