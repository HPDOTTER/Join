

let contacts = [
  {
    'name' : 'Jutta Berger',
    'email' : 'jber@gmx.de',
    'phone' : '+49123 456789',
  },
  {
    'name' : 'Josef Müller',
    'email' : 'jmueller@gmx.de',
    'phone' : '+49123 456789',
  },
  {
    'name' : 'Anna Horn',
    'email' : 'ahorn@gmx.de',
    'phone' : '+49123 456789',
  },
  {
    'name' : 'Anton Sippel',
    'email' : 'sippel@gmx.de',
    'phone' : '+49123 456789',
  },
  {
    'name' : 'Theo Meister',
    'email' : 'tm@gmx.de',
    'phone' : '+49123 456789',
  }
];

let activeContactItem = null;


function showForm() {
  document.getElementById('contactForm').style.display = 'block';
  document.getElementById('contactFormOverlay').style.display = 'block';
}


function hideForm() {
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('contactFormOverlay').style.display = 'none';
}


document.addEventListener('click', function(event) {
  const contactDetailSection = document.getElementById('contactDetailSection');
  const contactListSection = document.querySelector('.contactListSection');
  if (!contactDetailSection.contains(event.target) && !contactListSection.contains(event.target)) {
    hideDetail();
  }
});


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
  } else {
    alert("Bitte füllen Sie alle Felder aus.");
  }

  document.getElementById('contactListName').value = '';
  document.getElementById('contactListEmail').value = '';
  document.getElementById('contactListPhone').value = '';
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
    letterHeader.className = 'letterHeader';
    letterHeader.textContent = letter;
    contactList.appendChild(letterHeader);

    groupedContacts[letter].forEach(contact => {
      const contactItem = document.createElement('div');
      contactItem.className = 'contactItem';
      contactItem.innerHTML = `<div class="contactAvatar">${getInitials(contact.name)}</div>
                               <div>
                                 <strong>${contact.name}</strong><br>
                                 ${contact.email}
                               </div>`;
      contactItem.onclick = () => showDetail(contact, contactItem);
      contactList.appendChild(contactItem);
    });
  });
}


document.addEventListener('DOMContentLoaded', hideDetail);

