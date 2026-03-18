function switchTab(pane, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.form-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(pane).classList.add('active');
}

function togglePw(id, btn) {
  const input = document.getElementById(id);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.textContent = isHidden ? 'Hide' : 'Show';
}

function setError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(e => e.textContent = "");
}

function handleSignup() {
  clearErrors();

  const firstname = document.getElementById("first-name").value.trim();
  const lastname = document.getElementById("last-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-pw").value.trim();

  let isValid = true;

  if (!firstname) {
    setError("error-first-name", "First name is required");
    isValid = false;
  }

  if (!lastname) {
    setError("error-last-name", "Last name is required");
    isValid = false;
  }

  if (!email) {
    setError("error-signup-email", "Email is required");
    isValid = false;
  }

  if (!password) {
    setError("error-signup-pw", "Password is required");
    isValid = false;
  } else if (password.length < 8) {
    setError("error-signup-pw", "Minimum 8 characters required");
    isValid = false;
  }

  if (!isValid) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = { firstname, lastname, email, password };

  const exists = users.some(u => u.email === email);
  if (exists) {
    setError("error-signup-email", "User already exists");
    return;
  }
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created successfully!");
}
function getCurrentUser() {
  const email = localStorage.getItem("currentUser");
  if (!email) return null;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  return users.find(u => u.email === email) || null;
}
function handleLogin() {
  clearErrors();

  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-pw").value.trim();

  let isValid = true;

  if (!email) {
    setError("error-login-email", "Email required");
    isValid = false;
  }

  if (!password) {
    setError("error-login-pw", "Password required");
    isValid = false;
  }

  if (!isValid) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(
    u => u.email.toLowerCase() === email && u.password === password
  );

  if (!foundUser) {
    setError("error-login-pw", "Invalid credentials");
    return;
  }

  const storelogin = {
    email: foundUser.email,
    firstname: foundUser.firstname,
    lastname: foundUser.lastname
  };

  localStorage.setItem("currentUser", JSON.stringify(storelogin));
  alert("Login successful!");

  if (localStorage.getItem("currentUser")) {
    window.location.href = "welcome.html";
  }

}


localStorage.setItem("currentUser", JSON.stringify(foundUser));
