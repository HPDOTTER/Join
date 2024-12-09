const visibilityBtn = document.getElementById('login-password-icon');
const visibilityBtn1 = document.getElementById('repeat-password-icon');
const form = document.getElementById('form');
const errorMessage = document.getElementById('login-error-message');
const passwordInput = document.getElementById('login-password-input');
const emailInput = document.getElementById('login-email-input');
const repeatPasswordInput = document.getElementById('repeat-password-input');
const signUpNameInput = document.getElementById('sign-up-name-input');
const rememberMeCheckbox = document.getElementById('rememberMe');
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
const msgBox = document.getElementById('msgBox');

let guest = {
  name: 'Guest',
};

if (msgBox) {
  if (msg) {
    msgBox.innerHTML = msg;
  } else {
    msgBox.style.display = 'none';
  }
} else {
  console.error('Message box element not found');
}

const allInputs = [signUpNameInput, emailInput, passwordInput, repeatPasswordInput].filter(input => input != null);

async function signUpSubmit(e) {
  e.preventDefault(); 
  const errors = await getSignupFormErrors(signUpNameInput.value, emailInput.value, passwordInput.value, repeatPasswordInput.value);
  if (errors.length === 0 || errors.length === null) {
    addUser();
  } else if (errors.length > 0) {
    errorMessage.innerText = errors.join(". ");
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault(); 
  let errors = [];

  if (signUpNameInput) { // If we have a firstname input then we are in the signup
    errors = getSignupFormErrors(signUpNameInput.value, emailInput.value, passwordInput.value, repeatPasswordInput.value);
  } else { // If we don't have a firstname input then we are in the login
    errors = getLoginFormErrors(emailInput.value, passwordInput.value);
  }
  if (errors.length > 0) {
    errorMessage.innerText = errors.join(". ");
  }
});

function addUser() {
  if (errors.length === 0) {
    users.push({
      'name': signUpNameInput.value,
      'email': emailInput.value,
      'password': passwordInput.value
    });
    save();
    showToastMessage('You Signed Up successfully', '')
    setTimeout(() => {
      smoothTransition('../html/login.html?msg=You have successfully signed up. Please log in.');
    }, 1200);
  }
}

async function signUpSubmit() {
  const errors = await getSignupFormErrors(signUpNameInput.value, emailInput.value, passwordInput.value, repeatPasswordInput.value);
  if (errors.length === 0 || errors.length === null) {
    addUser();
  } else if (errors.length > 0) {
    e.preventDefault();
    errorMessage.innerText = errors.join(". ");
  }
}

function loginSubmit() {
  let user = users.find(user => user.email === emailInput.value && user.password === passwordInput.value);
  if (user) {
    loginSuccess(user);
    if (rememberMeCheckbox && rememberMeCheckbox.checked) {
      setLocalStorageLogin();
    } else {
      removeLocalStorageLogin()
    }
    smoothTransition('../html/summary.html?msg=You have successfully logged in.');
  } else {
    errorMessage.innerText = 'Email or password is incorrect';
  }
}

function removeLocalStorageLogin() {
  localStorage.removeItem('rememberMe');
  localStorage.removeItem('email');
  localStorage.removeItem('password');
}

function setLocalStorageLogin() {
  localStorage.setItem('rememberMe', 'true');
  localStorage.setItem('email', emailInput.value);
  localStorage.setItem('password', passwordInput.value);
}

function loginAsGuest() {
  loginSuccess(guest);
  smoothTransition('../html/summary.html?msg=You have successfully logged in as a guest.');
}

function loginSuccess(user) {
  if (user === guest) {
    sessionStorage.setItem('guest', JSON.stringify(guest));
  } else {
    sessionStorage.setItem('user', JSON.stringify(user.name));
  }
};

function rememberAutoFillIn() {
  if (localStorage.getItem('rememberMe') === 'true') {
    emailInput.value = localStorage.getItem('email');
    passwordInput.value = localStorage.getItem('password');
    if (rememberMeCheckbox) {
      rememberMeCheckbox.checked = true;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('fade-in');
  rememberAutoFillIn();
  welcomeAnimation();
  checkVisibilityIcons()
  setTimeout(() => {
    checkInputAfterLoad();
  }, 500); // Adjust the timeout as needed
});

function welcomeAnimation() {
  const logoOverlay = document.getElementById('logo-overlay');
  const logoOverlayImg = document.querySelector('.logo-overlay-img');
  const overlayShown = sessionStorage.getItem('overlayShown');
  if (!overlayShown) {
    setTimeout(() => {
      logoOverlay.classList.add('hidden');
    }, 100);
    logoOverlayImg.addEventListener('animationend', () => {
      logoOverlay.style.display = 'none';
    });
    sessionStorage.setItem('overlayShown', 'true');
  } else {
    logoOverlay.style.display = 'none';
  }
}

function checkInputAfterLoad() {
  if (passwordInput.value === "" || passwordInput.value === null) {
    visibilityBtn.src = '../assets/icons/icon-lock.svg';
  } else {
    visibilityBtn.src = '../assets/icons/icon-visibility-off.svg';
  }
  if (repeatPasswordInput) {
    if (repeatPasswordInput.value === "" || repeatPasswordInput.value === null) {
      visibilityBtn1.src = '../assets/icons/icon-lock.svg';
    } else {
      visibilityBtn1.src = '../assets/icons/icon-visibility-off.svg';
    }
  }
}

function checkVisibilityIcons() {
  if (visibilityBtn) {
    visibilityBtn.addEventListener('click', () => toggleVisibility(passwordInput, visibilityBtn));
  }
  passwordInput.addEventListener('keyup', () => {
    if (passwordInput.value === "" || passwordInput.value === null) {
      visibilityBtn.src = '../assets/icons/icon-lock.svg';
    } else {
      visibilityBtn.src = '../assets/icons/icon-visibility-off.svg';
    }
  });
  checkIfRepeatPasswordIsVisible();
}

function checkIfRepeatPasswordIsVisible() {
  if (visibilityBtn1) {
    visibilityBtn1.addEventListener('click', () => toggleVisibility(repeatPasswordInput, visibilityBtn1));
  }
  if (repeatPasswordInput) {
    repeatPasswordInput.addEventListener('keyup', () => {
      if (repeatPasswordInput.value === "" || repeatPasswordInput.value === null) {
        visibilityBtn1.src = '../assets/icons/icon-lock.svg';
      } else {
        visibilityBtn1.src = '../assets/icons/icon-visibility-off.svg';
      }
    });
  }
}

function toggleVisibility(input, btn) {
  if (input.value !== "" && input.value !== null) {
    if (input.type === 'password') {
      input.type = 'text';
      btn.src = '../assets/icons/icon-visibility.svg';
    } else {
      input.type = 'password';
      btn.src = '../assets/icons/icon-visibility-off.svg';
    }
  }
};

function getSignupFormErrors(name, email, password, repeatPassword) {
  let errors = [];
  validateField(name, 'Name is required', signUpNameInput, errors);
  validateField(email, 'Email is required', emailInput, errors);
  validatePassword(password, errors);
  if (password !== repeatPassword) {
    errors.push('Password does not match repeated password');
    passwordInput.parentElement.classList.add('incorrect');
    repeatPasswordInput.parentElement.classList.add('incorrect');
  }
  return errors;
}

function validateField(value, errorMessage, inputElement, errors) {
  if (value === '' || value == null) {
    errors.push(errorMessage);
    inputElement.parentElement.classList.add('incorrect');
  }
}

function validatePassword(password, errors) {
  if (password.length < 8) {
    errors.push('Password must have at least 8 characters');
    passwordInput.parentElement.classList.add('incorrect');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
    passwordInput.parentElement.classList.add('incorrect');
  }
}

function getLoginFormErrors(email, password) {
  let errors = [];

  if (email === '' || email == null) {
    errors.push('Email is required');
    emailInput.parentElement.classList.add('incorrect');
  }
  if (password === '' || password == null) {
    errors.push('Password is required');
    passwordInput.parentElement.classList.add('incorrect');
  }

  return errors;
}

allInputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input.parentElement.classList.contains('incorrect')) {
      input.parentElement.classList.remove('incorrect');
      errorMessage.innerText = '';
    }
  });
});

function enableSubmitButton() {
  const submitButton = document.getElementById('submit-button');
  if (submitButton.disabled === true) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}