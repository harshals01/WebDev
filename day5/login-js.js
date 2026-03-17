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