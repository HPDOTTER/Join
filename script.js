let users = [];
let tasks = [];
let contacts = [];
let statusTask = 1;
let errors = [];
const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

async function init() {
  handleMainMenuVisibility();
  await load();
  contacts = contacts.filter(contact => contact && contact.name);
  await save();
  waitForElement('#currentUserInitials', setCurrentUserInitials);
}

function smoothTransition(url) {
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = url;
  }, 500); // Match the duration of the CSS transition
}

function setCurrentUserInitials() {
  const currentUserInitials = document.getElementById('currentUserInitials');
  const guest = sessionStorage.getItem('guest');
  if (user) {
    const initials = user.split(' ').map(word => word[0]).join('').toUpperCase();
    currentUserInitials.innerHTML = initials;
  } else if (guest) {
    currentUserInitials.innerHTML = 'G';
  } else if (window.location.pathname.includes('/html/privacy-policy.html') || window.location.pathname.includes('/html/legal-notice.html')) {
    currentUserInitials.innerHTML = 'G';
  } else {
    currentUser();
  }
}


function currentUser() {
  const user = sessionStorage.getItem('user');
  const guest = sessionStorage.getItem('guest');
  if (user || guest) {
    return {
      user: user ? JSON.parse(user) : null,
      guest: guest ? JSON.parse(guest) : null
    };
  } else {
    smoothTransition('../html/login.html?msg=You are not logged in.');
  }
}

function logout() {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('guest');
  smoothTransition('../html/login.html?msg=You have successfully logged out.');
}

function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback();
  } else {
    const observer = new MutationObserver((mutations, me) => {
      const element = document.querySelector(selector);
      if (element) {
        callback();
        me.disconnect(); // Stop observing
      }
    });
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  }
}

function openLogout() {
  const logoutButton = document.getElementById('logoutPopUp');
  logoutButton.classList.toggle('d-block');
}

function navigateToUrl(url) {
  window.location.href = url;
}

function showToastMessage(text, fileName) {
  toastMsg = document.getElementById('toastMessage');
  toastMsg.innerHTML = getToastMessage(text, fileName);
  toastMsg.classList.remove('d-none');
  setTimeout(() => {
    toastMsg.classList.add('d-none');
  }, 1500);
}

function getToastMessage(text, fileName) {
  let toastMessage = '';
  toastMessage += text;
  if (fileName.length > 0) {
    toastMessage += `<img src="${fileName}" class="icon-toast-message">`
  }
  return toastMessage;
}

function goBack() {
  window.history.back();
}

document.addEventListener("DOMContentLoaded", function () {
  w3.includeHTML(() => {
    const pageId = document.body.getAttribute('data-page');
    const avatar = document.getElementById('headerAvatar');
    const help = document.getElementById('headerHelpIcon');
    const hidePages = ['legal-notice', 'privacy-policy'];
    if (avatar && hidePages.includes(pageId)) {
      avatar.style.display = 'none';
    }
    if (help && hidePages.includes(pageId)) {
      help.style.display = 'none';
    }
  });
});

function handleMainMenuVisibility() {
  const menuMain = document.getElementById('menuMain');
  const menuBar = document.getElementById('menuBar');
  const guest = sessionStorage.getItem('guest');
  if (menuMain && menuBar) {
    if (user || guest) {
      menuMain.style.display = 'flex';
      menuBar.style.justifyContent = 'space-between';
    } else {
      menuMain.style.display = 'none';
      menuBar.style.justifyContent = 'flex-end';
    }
  }
}

function handleMenuBarVisibility() {
  const guest = sessionStorage.getItem('guest');
  if (!(user || guest)) {
    if (window.innerWidth < 1200) {
      hideMenuBar();
    } else {
      showMenuBar();
    }
  }
}

function hideMenuBar() {
  let menuBar = document.getElementById('menuBarContainer');
  let siteBodyWrapper = document.getElementById('siteBodyWrapper');
  menuBar.style.display = 'none';
  siteBodyWrapper.style.height = 'calc(100vh - 96px)';
}

function showMenuBar() {
  menuBar = document.getElementById('menuBarContainer');
  menuBar.style.display = 'flex';
}

function getInitials(name) {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length === 1) {
    // If the name is a single word, return the first two characters
    return nameParts[0].substring(0, 2).toUpperCase();
  } else {
    // If the name has multiple words, return the first character of the first two words
    return nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
  }
}

const currentPath = window.location.pathname;
const menuLinks = [
  { id: 'summaryLink', path: '/html/summary.html' },
  { id: 'addTaskLink', path: '/html/add-task.html' },
  { id: 'boardLink', path: '/html/board.html' },
  { id: 'contactsLink', path: '/html/contacts.html' },
  { id: 'privacyPolicyLink', path: '/html/privacy-policy.html' },
  { id: 'legalNoticeLink', path: '/html/legal-notice.html' },
];

document.addEventListener("DOMContentLoaded", () => {
  const checkLinks = setInterval(() => {
    const menuLink = document.getElementById('summaryLink');
    if (menuLink) {
      clearInterval(checkLinks);
      menuLinks.forEach(link => {
        const element = document.getElementById(link.id);
        if (link.path === currentPath) {
          if (link.id === 'privacyPolicyLink' || link.id === 'legalNoticeLink') {
            element.classList.add('menu-legal-section-link-activated');
          } else {
            element.classList.add('menu-main-link-activated');
          }
        } else {
          element.classList.remove('menu-main-link-activated');
          element.classList.remove('menu-legal-section-link-activated');
        }
      })
    }
  }, 10);
});
