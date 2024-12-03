let users = [];
let tasks = [];
let contacts = [];
let statusTask = 1;
const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

async function init() {
  await load();
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
  if (user) {
      const initials = user.split(' ').map(word => word[0]).join('').toUpperCase();
      currentUserInitials.innerHTML = initials;
  } else {
      currentUserInitials.innerHTML = 'G';
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