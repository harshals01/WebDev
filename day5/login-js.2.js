let _pendingSignupData = null;  
let _resendTimer       = null;

function switchTab(pane, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.form-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(pane).classList.add('active');
}


function togglePw(id, btn) {
  const input = document.getElementById(id);
  const isHidden = input.type === 'password';
  input.type      = isHidden ? 'text' : 'password';
  btn.textContent = isHidden ? 'Hide' : 'Show';
}


function setError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(e => e.textContent = '');
}


function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('currentUser')) || null; }
  catch { return null; }
}


async function handleSignup() {
  clearErrors();

  const name     = document.getElementById('name').value.trim();
  const phone    = document.getElementById('phone').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-pw').value;
  const acceptTc = document.getElementById('accept-tc').checked;

  let isValid = true;

  if (!name) {
    setError('error-name',   'Full name is required');           isValid = false;
  }
  if (!phone) {
    setError('error-phone',        'Phone is required');         isValid = false;
  }else if (phone.length !== 10) {
    setError('error-phone',    '10 digits required'); isValid = false;
  }
  if (!email) {
    setError('error-signup-email', 'Email is required');         isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('error-signup-email', 'Enter a valid email address'); isValid = false;
  }
  if (!password) {
    setError('error-signup-pw',    'Password is required');      isValid = false;
  } else if (password.length < 8) {
    setError('error-signup-pw',    'Minimum 8 characters required'); isValid = false;
  }
  if (!acceptTc) {
    setError('error-accept-tc', 'You must accept the Terms & Conditions and Privacy Policy to continue.'); isValid = false;
  }

  if (!isValid) return;

  const btn = document.querySelector('#signup .submit-btn');
  btn.disabled    = true;
  btn.textContent = 'Sending…';

  try {
    const res  = await fetch('https://saleofy.com/api/user/register?step=1', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password, phone, accept_tc: acceptTc }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.errors) {
        if (data.errors.email)     setError('error-signup-email', data.errors.email);
        if (data.errors.password)  setError('error-signup-pw',    data.errors.password);
        if (data.errors.name)      setError('error-name',         data.errors.name);
        if (data.errors.phone)     setError('error-phone',        data.errors.phone);
      } else {
        setError('error-signup-email', data.message || data.error || 'Failed to send OTP. Please try again.');
      }
      return;
    }

    _pendingSignupData = { name, password, phone, email };

    document.getElementById('otp-email-label').textContent = email;
    clearOtpInputs();
    document.querySelectorAll('.form-pane').forEach(p => p.classList.remove('active'));
    document.getElementById('otp-verify').classList.add('active');
    setTimeout(() => document.querySelector('.otp-input').focus(), 80);

    startResendCooldown(30);

  } catch (err) {
    console.error('Send OTP error:', err);
    setError('error-signup-email', 'Network error. Please check your connection.');
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Continue';
  }
}


async function verifyOtpAndRegister() {
  const inputs = document.querySelectorAll('.otp-input');
  const code   = Array.from(inputs).map(i => i.value).join('');
  const errEl  = document.getElementById('error-otp');

  errEl.textContent = '';

  if (code.length < 6) {
    errEl.textContent = 'Please enter the full 6-digit code.';
    return;
  }

  if (!_pendingSignupData) {
    errEl.textContent = 'Session expired. Please go back and try again.';
    return;
  }

  const btn = document.querySelector('#otp-verify .submit-btn');
  btn.disabled    = true;
  btn.textContent = 'Verifying…';

  const { name, phone, email, password } = _pendingSignupData;

  try {
    const res  = await fetch('https://saleofy.com/api/user/register?step=2', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, phone, email, password, otp: code }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.errors?.otp) {
        errEl.textContent = data.errors.otp;
        return;
      }
      if (data.errors) {
        if (data.errors.email)     setError('error-signup-email', data.errors.email);
        if (data.errors.password)  setError('error-signup-pw',    data.errors.password);
        if (data.errors.name)      setError('error-name',         data.errors.name);
        if (data.errors.phone)     setError('error-phone',        data.errors.phone);
        if (data.errors.phone)     setError('error-signup-phone',        data.errors.phone);
        document.querySelectorAll('.form-pane').forEach(p => p.classList.remove('active'));
        document.getElementById('signup').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.remove('active');
        return;
      }
      errEl.textContent = data.message || data.error || 'Invalid or expired code.';
      return;
    }

    if (data.token || data.access_token) {
      const sessionUser = {
        email,
        name,
        phone,
        token: data.token || data.access_token,
      };
      localStorage.setItem('currentUser', JSON.stringify(sessionUser));
      localStorage.setItem('authToken', sessionUser.token);
    }

    _pendingSignupData = null;
    clearResendCooldown();

    alert('Account created successfully!');
    window.location.href = 'welcome.html';

  } catch (err) {
    console.error('Verify/Register error:', err);
    errEl.textContent = 'Network error. Please check your connection.';
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Verify & Create Account';
  }
}


async function resendOtp() {
  if (!_pendingSignupData) return;

  try {
    await fetch('https://saleofy.com/api/user/register?step=1', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(_pendingSignupData),
    });
  } catch (e) {
    console.error('Resend error:', e);
  }

  clearOtpInputs();
  document.getElementById('error-otp').textContent = '';
  document.querySelector('.otp-input').focus();
  startResendCooldown(30);
}


function startResendCooldown(seconds) {
  const link  = document.getElementById('resend-link');
  const timer = document.getElementById('resend-timer');

  link.classList.add('disabled');
  link.style.display  = 'none';
  timer.style.display = 'inline';

  let remaining = seconds;
  timer.textContent = `Resend in ${remaining}s`;

  clearResendCooldown();

  _resendTimer = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearResendCooldown();
      timer.style.display = 'none';
      link.style.display  = 'inline';
      link.classList.remove('disabled');
    } else {
      timer.textContent = `Resend in ${remaining}s`;
    }
  }, 1000);
}

function clearResendCooldown() {
  if (_resendTimer) { clearInterval(_resendTimer); _resendTimer = null; }
}


function clearOtpInputs() {
  document.querySelectorAll('.otp-input').forEach(i => {
    i.value = '';
    i.classList.remove('filled');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const otpInputs = document.querySelectorAll('.otp-input');

  otpInputs.forEach((input, idx) => {
    input.addEventListener('input', e => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val ? val[val.length - 1] : '';
      e.target.classList.toggle('filled', !!e.target.value);
      if (e.target.value && idx < otpInputs.length - 1) otpInputs[idx + 1].focus();
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace'  && !input.value && idx > 0)         otpInputs[idx - 1].focus();
      if (e.key === 'ArrowLeft'  && idx > 0)                         otpInputs[idx - 1].focus();
      if (e.key === 'ArrowRight' && idx < otpInputs.length - 1)     otpInputs[idx + 1].focus();
    });

    input.addEventListener('paste', e => {
      e.preventDefault();
      const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
      pasted.split('').forEach((ch, i) => {
        if (otpInputs[i]) { otpInputs[i].value = ch; otpInputs[i].classList.add('filled'); }
      });
      const next = otpInputs[Math.min(pasted.length, otpInputs.length - 1)];
      if (next) next.focus();
    });
  });
});


async function handleLogin() {
  clearErrors();

  const email    = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-pw').value.trim();

  let isValid = true;
  if (!email)    { setError('error-login-email', 'Email required');    isValid = false; }
  if (!password) { setError('error-login-pw',    'Password required'); isValid = false; }
  if (!isValid) return;

  try {
    const response = await fetch('https://saleofy.com/api/user/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError('error-login-pw', data.message || data.error || 'Invalid credentials');
      return;
    }

    const sessionUser = {
      email:     data.user?.email                              || email,
      name:      data.user?.name || data.user?.first_name     || '',
      phone:     data.user?.phone                             || '',
      token:     data.token           || data.access_token    || '',
    };

    localStorage.setItem('currentUser', JSON.stringify(sessionUser));
    if (sessionUser.token) localStorage.setItem('authToken', sessionUser.token);

    alert('Login successful!');
    window.location.href = 'welcome.html';

  } catch (err) {
    console.error('Login error:', err);
    setError('error-login-pw', 'Network error. Please check your connection.');
  }
}
