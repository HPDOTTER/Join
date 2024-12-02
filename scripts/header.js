function setCurrentUserInitials() {
    const currentUserInitials = document.getElementById('currentUserInitials');
    if (user) {
        const initials = user.split(' ').map(word => word[0]).join('').toUpperCase();
        currentUserInitials.innerHTML = initials;
    } else {
        currentUserInitials.innerHTML = 'G';
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