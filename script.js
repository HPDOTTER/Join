/**
 * Global variables to manage users, tasks, contacts, and status.
 */
let users = [];
let tasks = [];
let contacts = [];
let errors = [];
const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

/**
 * Initializes the application by handling the main menu visibility,
 * loading data, filtering contacts, and setting user initials.
 */
async function init() {
  handleMainMenuVisibility();
  await load();
  contacts = contacts.filter(contact => contact && contact.name);
  await save();
  waitForElement('#currentUserInitials', setCurrentUserInitials);
}

/**
 * Navigates to a new URL with a smooth fade-out transition.
 * @param {string} url - The URL to navigate to.
 */
function smoothTransition(url) {
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = url;
  }, 500); // Match the duration of the CSS transition
}

/**
 * Sets the initials of the current user or guest in the UI.
 */
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

/**
 * Retrieves the current user or guest information from session storage.
 * @returns {Object} The user or guest object.
 */
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

/**
 * Logs out the current user or guest and redirects to the login page.
 */
function logout() {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('guest');
  smoothTransition('../html/login.html?msg=You have successfully logged out.');
}

/**
 * Waits for an element to be added to the DOM and executes a callback.
 * @param {string} selector - The CSS selector for the element.
 * @param {Function} callback - The callback function to execute when the element is found.
 */
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

/**
 * Toggles the visibility of the logout popup.
 */
function openLogout() {
  const logoutButton = document.getElementById('logoutPopUp');
  logoutButton.classList.toggle('d-block');
}

/**
 * Navigates to a specified URL.
 * @param {string} url - The URL to navigate to.
 */
function navigateToUrl(url) {
  window.location.href = url;
}

/**
 * Displays a toast message with optional image.
 * @param {string} text - The text of the toast message.
 * @param {string} fileName - The file name of the image to display.
 */
function showToastMessage(text, fileName) {
  const toastMsg = document.getElementById('toastMessage');
  toastMsg.innerHTML = getToastMessage(text, fileName);
  toastMsg.classList.remove('d-none');
  setTimeout(() => {
    toastMsg.classList.add('d-none');
  }, 1500);
}

/**
 * Generates the HTML content for a toast message.
 * @param {string} text - The text of the toast message.
 * @param {string} fileName - The file name of the image to display.
 * @returns {string} The HTML content for the toast message.
 */
function getToastMessage(text, fileName) {
  let toastMessage = '';
  toastMessage += text;
  if (fileName.length > 0) {
    toastMessage += `<img src="${fileName}" class="icon-toast-message">`;
  }
  return toastMessage;
}

/**
 * Navigates back to the previous page in the browser history.
 */
function goBack() {
  window.history.back();
}

/**
 * Initializes the page after the DOM content is loaded.
 */
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

/**
 * Handles the visibility of the main menu based on user or guest status.
 */
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

/**
 * Handles the visibility of the menu bar based on the screen width and user/guest status.
 */
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

/**
 * Hides the menu bar and adjusts the site body wrapper height.
 */
function hideMenuBar() {
  const menuBar = document.getElementById('menuBarContainer');
  const siteBodyWrapper = document.getElementById('siteBodyWrapper');
  menuBar.style.display = 'none';
  siteBodyWrapper.style.height = 'calc(100vh - 96px)';
}

/**
 * Shows the menu bar.
 */
function showMenuBar() {
  const menuBar = document.getElementById('menuBarContainer');
  menuBar.style.display = 'flex';
}

/**
 * Gets the initials of a given name.
 * @param {string} name - The full name to extract initials from.
 * @returns {string} The initials of the name.
 */
function getInitials(name) {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  } else {
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

/**
 * Highlights the active menu link based on the current page path.
 */
document.addEventListener("DOMContentLoaded", () => {
  const checkLinks = setInterval(() => {
    const menuLink = document.getElementById('summaryLink');
    const menuLink1 = document.getElementById('addTaskLink');
    const menuLink2 = document.getElementById('boardLink');
    const menuLink3 = document.getElementById('contactsLink');
    const menuLink4 = document.getElementById('privacyPolicyLink');
    const menuLink5 = document.getElementById('legalNoticeLink');
    if (menuLink && menuLink1 && menuLink2 && menuLink3 && menuLink4 && menuLink5) {
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
      });
    }
    console.log('Schleife');
  }, 10);
});

