function switchTab(paneId, btn) {
  document.querySelectorAll('.form-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(paneId).classList.add('active');
  btn.classList.add('active');
  clearAllErrors();
}

function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  const showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  btn.textContent = showing ? 'Show' : 'Hide';
}


function setError(fieldId, msg) {
  const el = document.getElementById(`error-${fieldId}`);
  const input = document.getElementById(fieldId);
  if (el)    { el.textContent = msg; }
  if (input) { msg ? input.classList.add('has-error') : input.classList.remove('has-error'); }
  return !!msg;
}
 
function clearAllErrors() {
  document.querySelectorAll('.error').forEach(e => e.textContent = '');
  document.querySelectorAll('input').forEach(i => i.classList.remove('has-error'));
  hideAlert('login-alert');
  hideAlert('signup-alert');
}
 
function showAlert(id, msg, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `form-alert ${type} show`;
}
 
function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}
 
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
 
