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

function setCurrentUserInitials() {
    const currentUserInitials = document.getElementById('currentUserInitials');
    if (!currentUserInitials) {
        console.error('Element with ID "currentUserInitials" not found');
        return;
    }
    const user = currentUser().user;
    if (user) {
        const initials = user.name.split(' ').map(word => word[0]).join('').toUpperCase();
        currentUserInitials.innerHTML = initials;
    }
}

function logout() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('guest');
    smoothTransition('../html/login.html?msg=You have successfully logged out.');
}

function smoothTransition(url) {
    document.body.classList.add('fade-out');
    setTimeout(() => {
      window.location.href = url;
    }, 500); // Match the duration of the CSS transition
}

// Call setCurrentUserInitials after getting the current user
document.addEventListener('DOMContentLoaded', () => {
    const user = currentUser();
    if (user) {
        setCurrentUserInitials();
    }
});