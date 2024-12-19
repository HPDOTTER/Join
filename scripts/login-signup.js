/**
 * Handles the visibility toggle for the password input fields and their associated icons.
 */
const visibilityBtn = document.getElementById('login-password-icon');
const visibilityBtn1 = document.getElementById('repeat-password-icon');

/**
 * References the form element for signup or login.
 */
const form = document.getElementById('form');

/**
 * Displays error messages during form submission.
 */
const errorMessage = document.getElementById('login-error-message');

/**
 * References the password input field.
 */
const passwordInput = document.getElementById('login-password-input');

/**
 * References the email input field.
 */
const emailInput = document.getElementById('login-email-input');

/**
 * References the repeat password input field (signup form only).
 */
const repeatPasswordInput = document.getElementById('repeat-password-input');

/**
 * References the signup name input field (signup form only).
 */
const signUpNameInput = document.getElementById('sign-up-name-input');

/**
 * References the "Remember Me" checkbox.
 */
const rememberMeCheckbox = document.getElementById('rememberMe');

/**
 * Parses URL parameters for messages.
 */
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
const msgBox = document.getElementById('msgBox');

/**
 * Represents a guest user.
 */
let guest = {
  name: 'Guest',
};

/**
 * Collects all input fields used in the form.
 */
const allInputs = [signUpNameInput, emailInput, passwordInput, repeatPasswordInput].filter(input => input != null);

if (msgBox) {
  if (msg) {
    msgBox.innerHTML = msg;
  } else {
    msgBox.style.display = 'none';
  }
} else {
  console.error('Message box element not found');
}

/**
 * Handles the submission of the signup form.
 * @param {Event} e - The form submit event.
 */
async function signUpSubmit(e) {
  const errors = await getSignupFormErrors(signUpNameInput.value, emailInput.value, passwordInput.value, repeatPasswordInput.value);
  if (errors.length === 0 || errors.length === null) {
    addUser();
  } else if (errors.length > 0) {
    e.preventDefault();
    errorMessage.innerText = errors.join(". ");
  }
}

/**
 * Handles the form submission event.
 *
 * Prevents the default form submission behavior, validates the input fields,
 * and displays error messages if any validation errors are found.
 * Differentiates between login and signup forms based on the presence
 * of the `signUpNameInput` field.
 *
 * @param {Event} e - The form submission event.
 */
form.addEventListener('submit', (e) => {
  let errors = [];
  e.preventDefault(); // Prevent the form from submitting
  if (signUpNameInput) { // If we have a firstname input then we are in the signup
    errors = getSignupFormErrors(signUpNameInput.value, emailInput.value, passwordInput.value, repeatPasswordInput.value);
    signUpSubmit(e);
  } else { // If we don't have a firstname input then we are in the login
    errors = getLoginFormErrors(emailInput.value, passwordInput.value);
  }
  if (errors.length > 0) {
    errorMessage.innerText = errors.join(". ");
  }
});

/**
 * Adds a new user to the user and contacts arrays.
 */
function addUser() {
  if (errors.length === 0) {
    addUserPushArray();
    save();
    showToastMessage('You Signed Up successfully', '')
    setTimeout(() => {
      smoothTransition('../html/login.html?msg=You have successfully signed up. Please log in.');
    }, 1200);
  }
}

/**
 * Pushes a new user into the users and contacts arrays.
 */
function addUserPushArray() {
  users.push({
    'name': signUpNameInput.value,
    'email': emailInput.value,
    'password': passwordInput.value
  });
  contacts.push({
    'name': signUpNameInput.value,
    'email': emailInput.value,
    'phone': '',
    'color': contactColors[Math.floor(Math.random() * 14)],
    'user': true,
  });
}

/**
 * Handles the login process for existing users.
 */
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

/**
 * Removes login data from local storage.
 */
function removeLocalStorageLogin() {
  localStorage.removeItem('rememberMe');
  localStorage.removeItem('email');
  localStorage.removeItem('password');
}

/**
 * Sets login data in local storage for the "Remember Me" feature.
 */
function setLocalStorageLogin() {
  localStorage.setItem('rememberMe', 'true');
  localStorage.setItem('email', emailInput.value);
  localStorage.setItem('password', passwordInput.value);
}

/**
 * Handles the login process for guest users.
 */
function loginAsGuest() {
  loginSuccess(guest);
  smoothTransition('../html/summary.html?msg=You have successfully logged in as a guest.');
}

/**
 * Handles successful login.
 * @param {Object} user - The user object representing the logged-in user.
 */
function loginSuccess(user) {
  if (user === guest) {
    sessionStorage.setItem('guest', JSON.stringify(guest));
  } else {
    sessionStorage.setItem('user', JSON.stringify(user.name));
  }
};

/**
 * Automatically fills in login data if "Remember Me" is enabled.
 */
function rememberAutoFillIn() {
  if (localStorage.getItem('rememberMe') === 'true') {
    emailInput.value = localStorage.getItem('email');
    passwordInput.value = localStorage.getItem('password');
    if (rememberMeCheckbox) {
      rememberMeCheckbox.checked = true;
    }
  }
}

/**
 * Initializes event listeners and animations when the DOM content is fully loaded.
 *
 * Adds a fade-in effect to the body, automatically fills in login credentials
 * if "remember me" is checked, and initializes visibility toggles and input checks.
 */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('fade-in');
  rememberAutoFillIn();
  welcomeAnimation();
  checkVisibilityIcons();
  setTimeout(() => {
    checkInputAfterLoad();
  }, 500);
});

/**
 * Animates the welcome overlay.
 */
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

/**
 * Updates the visibility icons based on input values after loading.
 */
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

/**
 * Sets up visibility toggle functionality for input fields.
 */
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

/**
 * Adds an event listener to toggle password visibility for the repeat password field.
 */
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

/**
 * Toggles the visibility of a password input field.
 *
 * @param {HTMLInputElement} input - The input field to toggle.
 * @param {HTMLImageElement} btn - The button element controlling visibility.
 */
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

/**
 * Validates the signup form fields and returns a list of error messages.
 *
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} repeatPassword - The repeated password.
 * @returns {string[]} An array of error messages.
 */
function getSignupFormErrors(name, email, password, repeatPassword) {
  let errors = [];
  validateField(name, 'Name is required', signUpNameInput, errors);
  validateField(email, 'Email is required', emailInput, errors);
  validatePassword(password, errors);
  validatePasswordUser(name, email, password, repeatPassword);
  return errors;
}

/**
 * Validates a single form field.
 *
 * @param {string} value - The value of the field to validate.
 * @param {string} errorMessage - The error message to display if validation fails.
 * @param {HTMLElement} inputElement - The input element being validated.
 * @param {string[]} errors - The array to store error messages.
 */
function validateField(value, errorMessage, inputElement, errors) {
  if (value === '' || value == null) {
    errors.push(errorMessage);
    inputElement.parentElement.classList.add('incorrect');
  }
}

/**
 * Validates the password field for specific criteria.
 *
 * @param {string} password - The password to validate.
 * @param {string[]} errors - The array to store error messages.
 */
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

/**
 * Validates password-related criteria including matching passwords and unique user information.
 *
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} repeatPassword - The repeated password.
 */
function validatePasswordUser(name, email, password, repeatPassword) {
  if (password !== repeatPassword) {
    errors.push('Password does not match repeated password');
    passwordInput.parentElement.classList.add('incorrect');
    repeatPasswordInput.parentElement.classList.add('incorrect');
  }
  if (users.find(user => user.email === email)) {
    errors.push('Email is already in use');
    emailInput.parentElement.classList.add('incorrect');
  }
  if (users.find(user => user.name === name)) {
    errors.push('Name is already in use');
    signUpNameInput.parentElement.classList.add('incorrect');
  }
}

/**
 * Validates the login form fields and returns a list of error messages.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {string[]} An array of error messages.
 */
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

/**
 * Adds event listeners to all input fields to remove error styles when corrected.
 */
allInputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input.parentElement.classList.contains('incorrect')) {
      input.parentElement.classList.remove('incorrect');
      errorMessage.innerText = '';
    }
  });
});

/**
 * Toggles the enabled/disabled state of the submit button.
 */
function enableSubmitButton() {
  const submitButton = document.getElementById('submit-button');
  if (submitButton.disabled === true) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

