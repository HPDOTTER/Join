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


const guest = {
  name: 'Guest',
  email: 'guest@example.com',
  password: 'guest'
};

function addUser() {
  if (passwordInput.value === repeatPasswordInput.value) {
    users.push({
      'name': signUpNameInput.value,
      'email': emailInput.value,
      'password': passwordInput.value
    });
    smoothTransition('../html/login.html?msg=You have successfully signed up. Please log in.');
    save()
  } else {
    getSignupFormErrors(signUpNameInput.value, emailInput.value, passwordInput.value, repeatPasswordInput.value);
  }
}

function login() {
  let user = users.find(user => user.email === emailInput.value && user.password === passwordInput.value);
  if (user) {
    loginSuccess(user);
    if (rememberMeCheckbox && rememberMeCheckbox.checked) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('email', emailInput.value);
      localStorage.setItem('password', passwordInput.value);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
    smoothTransition('../html/summary.html?msg=You have successfully logged in.');
  } else {
    errorMessage.innerText = 'Email or password is incorrect';
  }
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

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('fade-in');

  if (localStorage.getItem('rememberMe') === 'true') {
    emailInput.value = localStorage.getItem('email');
    passwordInput.value = localStorage.getItem('password');
    if (rememberMeCheckbox) {
      rememberMeCheckbox.checked = true;
    }
  }

  if (visibilityBtn) {
    visibilityBtn.addEventListener('click', () => toggleVisibility(passwordInput, visibilityBtn));
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const logoOverlay = document.getElementById('logo-overlay');
  const logoOverlayImg = document.querySelector('.logo-overlay-img');
  const overlayShown = sessionStorage.getItem('overlayShown');

  if (!overlayShown) {
    setTimeout(() => {
      logoOverlay.classList.add('hidden');
    }, 100); // Adjust the timeout as needed

    logoOverlayImg.addEventListener('animationend', () => {
      logoOverlay.style.display = 'none';
    });

    sessionStorage.setItem('overlayShown', 'true');
  } else {
    logoOverlay.style.display = 'none';
  }
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
});

passwordInput.addEventListener('keyup', () => {
  if(passwordInput.value === "" || passwordInput.value === null){
    visibilityBtn.src = '../assets/icons/icon-lock.svg'
  } else {
    visibilityBtn.src = '../assets/icons/icon-visibility-off.svg'
  }
})

function toggleVisibility(input, btn) {
  if(input.value !== "" && input.value !== null) {
    if(input.type === 'password') {
      input.type = 'text'
      btn.src = '../assets/icons/icon-visibility.svg'
    } else {
      input.type = 'password'
      btn.src = '../assets/icons/icon-visibility-off.svg'
    }
  }
}

form.addEventListener('submit', (e) => {
    let errors = []
  
    if(signUpNameInput){
      // If we have a firstname input then we are in the signup
      errors = getSignupFormErrors(signUpNameInput.value, emailInput.value, passwordInput.value, repeatPasswordInput.value)
    }
    else{
      // If we don't have a firstname input then we are in the login
      errors = getLoginFormErrors(emailInput.value, passwordInput.value)
    }
  
    if(errors.length > 0){
      // If there are any errors
      e.preventDefault()
      errorMessage.innerText  = errors.join(". ")
    }
  })

  function getSignupFormErrors(firstname, email, password, repeatPassword){
    let errors = []
  
    if(firstname === '' || firstname == null){
      errors.push('Firstname is required')
      signUpNameInput.parentElement.classList.add('incorrect')
    }
    if(email === '' || email == null){
      errors.push('Email is required')
      emailInput.parentElement.classList.add('incorrect')
      console.log(errors);
    }
    if(password === '' || password == null){
      errors.push('Password is required')
      passwordInput.parentElement.classList.add('incorrect')
    }
    if(password.length < 8){
      errors.push('Password must have at least 8 characters')
      passwordInput.parentElement.classList.add('incorrect')
    }
    if(!/[A-Z]/.test(password)){
      errors.push('Password must contain at least one uppercase letter')
      passwordInput.parentElement.classList.add('incorrect')
    }
    if(password !== repeatPassword){
      errors.push('Password does not match repeated password')
      passwordInput.parentElement.classList.add('incorrect')
      repeatPasswordInput.parentElement.classList.add('incorrect')
    }
  
    return errors;
  }

  function getLoginFormErrors(email, password){
    let errors = []
  
    if(email === '' || email == null){
      errors.push('Email is required')
      emailInput.parentElement.classList.add('incorrect')
    }
    if(password === '' || password == null){
      errors.push('Password is required')
      passwordInput.parentElement.classList.add('incorrect')
    }
  
    return errors;
  }
  
  allInputs.forEach(input => {
    input.addEventListener('input', () => {
      if(input.parentElement.classList.contains('incorrect')){
        input.parentElement.classList.remove('incorrect')
        errorMessage.innerText = ''
      }
    })
  })

  function enableSubmitButton(){
    const submitButton = document.getElementById('submit-button')
    if(submitButton.disabled === true){
      submitButton.disabled = false
    } else {
      submitButton.disabled = true
    }
  }