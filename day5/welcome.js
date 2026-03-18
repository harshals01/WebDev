function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function loadWelcome() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "welcome.html";
    return;
  }

  const fullName = `${user.firstname} ${user.lastname}`;

  document.getElementById("welcome-text").textContent =
    `Hello - ${fullName}`;
}

// logout
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login-signup.html";
}

// run on page load
loadWelcome();
