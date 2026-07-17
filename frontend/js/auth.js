document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const alertBox = document.getElementById('alertBox');

  // Helper to show alert messages
  const showAlert = (message, type = 'danger') => {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // Helper to clear alerts
  const clearAlert = () => {
    alertBox.className = 'alert alert-hidden';
    alertBox.textContent = '';
  };

  // Simple email regex validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // --- LOGIN LOGIC ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAlert();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      // Validation checks
      if (!email || !password) {
        showAlert('Please fill in all fields');
        return;
      }

      if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address');
        return;
      }

      try {
        const response = await ApiClient.post('/auth/login', { email, password });
        
        // Save auth data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        
        showAlert('Success! Redirecting...', 'success');
        setTimeout(() => {
          window.location.replace('/pages/dashboard.html');
        }, 800);

      } catch (err) {
        showAlert(err.message || 'Login failed. Please check your credentials.');
      }
    });
  }

  // --- REGISTRATION LOGIC ---
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAlert();

      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      // Validation checks
      if (!username || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields');
        return;
      }

      if (username.length < 3) {
        showAlert('Username must be at least 3 characters long');
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showAlert('Username can only contain alphanumeric characters and underscores');
        return;
      }

      if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address');
        return;
      }

      if (password.length < 6) {
        showAlert('Password must be at least 6 characters long');
        return;
      }

      if (password !== confirmPassword) {
        showAlert('Passwords do not match');
        return;
      }

      try {
        const response = await ApiClient.post('/auth/register', { username, email, password });
        
        showAlert('Account created successfully! Redirecting to login...', 'success');
        
        // Disable form inputs to prevent double clicks during transit
        registerForm.querySelectorAll('input, button').forEach(el => el.disabled = true);
        
        setTimeout(() => {
          window.location.replace('/pages/login.html');
        }, 1500);

      } catch (err) {
        if (err.errors && err.errors.length > 0) {
          // Display first validation failure details
          showAlert(err.errors[0].message);
        } else {
          showAlert(err.message || 'Registration failed');
        }
      }
    });
  }
});
