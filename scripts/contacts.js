

let contacts = [
  {
    'name' : 'Jutta Berger',
    'email' : 'jber@gmx.de',
    'phone' : '+49123 456789',
    'isUser' : false,
  },
  {
    'name' : 'Josef Müller',
    'email' : 'jmueller@gmx.de',
    'phone' : '+49123 456789',
    'isUser' : false,
  },
  {
    'name' : 'Anna Horn',
    'email' : 'ahorn@gmx.de',
    'phone' : '+49123 456789',
    'isUser' : false,
  },
  {
    'name' : 'Anton Sippel',
    'email' : 'sippel@gmx.de',
    'phone' : '+49123 456789',
    'isUser' : false,
  },
  {
    'name' : 'Theo Meister',
    'email' : 'tm@gmx.de',
    'phone' : '+49123 456789',
    'isUser' : false,
  }
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
  document.getElementById('contactDetailSection').style.display = 'block';
  document.getElementById('detailName').textContent = contact.name;
  document.getElementById('detailEmail').textContent = contact.email;
  document.getElementById('detailPhone').textContent = contact.phone;
  document.getElementById('contactAvatar').textContent = getInitials(contact.name);

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

function addContact() {
  const name = document.getElementById('contactListName').value.trim();
  const email = document.getElementById('contactListEmail').value.trim();
  const phone = document.getElementById('contactListPhone').value.trim();

  if (name && email && phone) {
    contacts.push({ name, email, phone });
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    renderContacts();
    hideForm();
    hideDetail();
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
  }
}

function saveContact() {
  if (currentContact) {
    currentContact.name = document.getElementById('editName').value.trim();
    currentContact.email = document.getElementById('editEmail').value.trim();
    currentContact.phone = document.getElementById('editPhone').value.trim();

    contacts.sort((a, b) => a.name.localeCompare(b.name));
    renderContacts();
    hideEditForm();
    hideDetail();
  }
}

function cancelEdit() {
  hideEditForm();
}

function hideEditForm() {
  document.getElementById('contactEditForm').style.display = 'none';
  document.getElementById('contactEditOverlay').style.display = 'none';
}

function cancelEdit() {
  hideEditForm();
}

function deleteContact() {
  if (currentContact) {
    contacts = contacts.filter(contact => contact !== currentContact);
    renderContacts();
    hideDetail();
  }
}

function renderContacts() {
  const contactList = document.getElementById('contact-list');
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
      contactItem.innerHTML = `<div class="contact-list-avatar">${getInitials(contact.name)}</div>
                               <div>
                                 <span class="contact-list-name">${contact.name}</span><br>
                                 <span class="contact-list-email">${contact.email}<span>
                               </div>`;
      contactItem.onclick = () => showDetail(contact, contactItem);
      contactList.appendChild(contactItem);
    });
  });
}

document.addEventListener('DOMContentLoaded', hideDetail);

