let users = [];
let tasks = [];
let statusTask = 1;

function smoothTransition(url) {
    document.body.classList.add('fade-out');
    setTimeout(() => {
      window.location.href = url;
    }, 500); // Match the duration of the CSS transition
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