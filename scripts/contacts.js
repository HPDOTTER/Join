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

let contacts = [
  {
    'name' : 'Anna Horn',
    'email' : 'ahorn@gmx.de',
    'phone' : '+49123 456789',
    'color' : contactColors[0],
    'isUser' : false,
  },
  {
    'name' : 'Anton Sippel',
    'email' : 'sippel@gmx.de',
    'phone' : '+49123 456789',
    'color' : contactColors[1],
    'isUser' : false,
  },
  {
    'name' : 'Bruce Wayne',
    'email' : 'the-bat@gmail.com',
    'phone' : '+49123 456789',
    'color' : contactColors[2],
    'isUser' : false,
  },
  {
    'name' : 'Daenerys Targaryen',
    'email' : 'motherofdragons@gmail.com',
    'phone' : '+49123 456789',
    'color' : contactColors[3],
    'isUser' : false,
  },
  {
    'name' : 'Jutta Berger',
    'email' : 'jber@gmx.de',
    'phone' : '+49123 456789',
    'color' : contactColors[4],
    'isUser' : false,
  },
  {
    'name' : 'Josef Müller',
    'email' : 'jmueller@gmx.de',
    'phone' : '+49123 456789',
    'color' : contactColors[5],
    'isUser' : false,
  },
  {
    'name' : 'Lisa Simpson',
    'email' : 'l.simpson@gmail.com',
    'phone' : '+49123 456789',
    'color' : contactColors[6],
    'isUser' : false,
  },
  {
    'name' : 'Saul Goodman',
    'email' : 'mcgill@gmail.com',
    'phone' : '+49123 456789',
    'color' : contactColors[7],
    'isUser' : false,
  },
  {
    'name' : 'Theo Meister',
    'email' : 'tm@gmx.de',
    'phone' : '+49123 456789',
    'color' : contactColors[8],
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
  renderDetail(contact);
  showDetailActive(contact, contactItem);
}

function renderDetail(contact) {
  document.getElementById('contactDetailSection').style.display = 'block';
  document.getElementById('detailName').textContent = contact.name;
  document.getElementById('detailEmail').textContent = contact.email;
  document.getElementById('detailPhone').textContent = contact.phone;
  document.getElementById('contactAvatar').textContent = getInitials(contact.name);
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

function addContact() {
  const name = document.getElementById('contactListName').value.trim();
  const email = document.getElementById('contactListEmail').value.trim();
  const phone = document.getElementById('contactListPhone').value.trim();

  if (name && email && phone) {
    contacts.push({ name, email, phone });
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    renderContacts();
    hideForm();
    // hideDetail();
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
    renderDetail(currentContact);
    hideEditForm();
    // hideDetail();
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

// document.addEventListener('DOMContentLoaded', hideDetail);

