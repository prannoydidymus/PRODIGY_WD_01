document.addEventListener('DOMContentLoaded', () => {
  // Navigation / View Switch Elements
  const loginView = document.getElementById('loginView');
  const registerView = document.getElementById('registerView');
  const dashboardView = document.getElementById('dashboardView');
  const toRegisterLink = document.getElementById('toRegister');
  const toLoginLink = document.getElementById('toLogin');

  // Form Elements
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const passwordInput = document.getElementById('registerPassword');
  
  // Toggles for Password Visibility
  const toggleLoginPass = document.getElementById('toggleLoginPass');
  const toggleRegPass = document.getElementById('toggleRegPass');

  // Strength Indicator Elements
  const strengthFill = document.getElementById('strengthFill');
  const strengthLabel = document.getElementById('strengthLabel');

  // Dashboard & Admin Panel Elements
  const dashUsername = document.getElementById('dashUsername');
  const dashRole = document.getElementById('dashRole');
  const dashAvatar = document.getElementById('dashAvatar');
  const userPanel = document.getElementById('userPanel');
  const adminPanel = document.getElementById('adminPanel');
  const userTableBody = document.getElementById('userTableBody');
  const logTerminal = document.getElementById('logTerminal');
  const logoutBtn = document.getElementById('logoutBtn');
  const alertContainer = document.getElementById('alertContainer');

  /* ==========================================================================
     1. Cryptographic Password Hashing (SHA-256)
     ========================================================================== */
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /* ==========================================================================
     2. Local Storage Mock Database Setup
     ========================================================================== */
  // Retrieve or initialize users database
  let usersDb = JSON.parse(localStorage.getItem('usersDb')) || [];
  let logsDb = JSON.parse(localStorage.getItem('logsDb')) || [];

  // Seed default users if database is empty
  async function seedDatabase() {
    if (usersDb.length === 0) {
      const adminHash = await hashPassword('Admin@123');
      const userHash = await hashPassword('User@123');

      usersDb.push(
        { username: 'administrator', email: 'admin@guardian.com', passwordHash: adminHash, role: 'admin' },
        { username: 'john_doe', email: 'user@guardian.com', passwordHash: userHash, role: 'user' }
      );
      localStorage.setItem('usersDb', JSON.stringify(usersDb));
      
      addLog('DATABASE', 'System database seeded with default Admin and User credentials.', 'success');
    }
  }
  seedDatabase();

  // Helper to add logs to terminal and database
  function addLog(action, message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { timestamp, action, message, type };
    
    logsDb.push(logEntry);
    // Limit log size to 100 entries
    if (logsDb.length > 100) logsDb.shift();
    
    localStorage.setItem('logsDb', JSON.stringify(logsDb));
    renderLogs();
  }

  // Render logs in the admin console
  function renderLogs() {
    if (!logTerminal) return;
    logTerminal.innerHTML = logsDb.map(log => `
      <div class="log-line">
        <span class="log-time">[${log.timestamp}]</span>
        <span class="log-action" style="font-weight: 600; color: #a5b4fc;">[${log.action}]</span>
        <span class="log-entry log-${log.type}">${log.message}</span>
      </div>
    `).join('');
    // Auto scroll to bottom of logs
    logTerminal.scrollTop = logTerminal.scrollHeight;
  }

  /* ==========================================================================
     3. Simple Router & Page View Switching
     ========================================================================== */
  function navigateTo(viewId) {
    // Hide all view panels
    loginView.classList.remove('active');
    registerView.classList.remove('active');
    dashboardView.classList.remove('active');

    // Show selected panel
    const targetPanel = document.getElementById(viewId);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Refresh view data if user lands on Dashboard
    if (viewId === 'dashboardView') {
      renderDashboard();
    }
  }

  // Links to switch views
  toRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('registerView');
  });

  toLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('loginView');
  });

  /* ==========================================================================
     4. Password Visibility Toggle
     ========================================================================== */
  function setupPasswordToggle(inputEl, toggleIcon) {
    toggleIcon.addEventListener('click', () => {
      if (inputEl.type === 'password') {
        inputEl.type = 'text';
        toggleIcon.className = 'fa-solid fa-eye password-toggle';
      } else {
        inputEl.type = 'password';
        toggleIcon.className = 'fa-solid fa-eye-slash password-toggle';
      }
    });
  }

  setupPasswordToggle(document.getElementById('loginPassword'), toggleLoginPass);
  setupPasswordToggle(passwordInput, toggleRegPass);

  /* ==========================================================================
     5. Real-Time Password Strength Validator
     ========================================================================== */
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      const result = checkPasswordStrength(password);
      
      // Update Strength Bar visual styles
      strengthFill.style.width = result.width;
      strengthFill.style.backgroundColor = result.color;
      strengthLabel.textContent = result.label;
      strengthLabel.style.color = result.color;
    });
  }

  function checkPasswordStrength(password) {
    if (password.length === 0) {
      return { width: '0%', color: 'transparent', label: 'Enter password' };
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        return { width: '25%', color: 'var(--color-danger)', label: 'Weak (At least 8 chars needed)' };
      case 2:
        return { width: '50%', color: 'var(--color-warning)', label: 'Fair (Add uppercase, numbers or symbols)' };
      case 3:
        return { width: '75%', color: 'var(--color-primary)', label: 'Good (Very secure)' };
      case 4:
        return { width: '100%', color: 'var(--color-success)', label: 'Strong (Highly secure encryption)' };
      default:
        return { width: '0%', color: 'transparent', label: 'Enter password' };
    }
  }

  /* ==========================================================================
     6. Registration Controller
     ========================================================================== */
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('registerUsername').value.trim().toLowerCase();
      const email = document.getElementById('registerEmail').value.trim().toLowerCase();
      const password = passwordInput.value;
      const role = document.getElementById('registerRole').value;
      const registerSubmitBtn = document.getElementById('registerSubmitBtn');

      // 1. Validation Checks
      if (!username || !email || !password) {
        showToast('Please fill in all inputs.', 'error');
        return;
      }

      const strength = checkPasswordStrength(password);
      if (password.length < 8) {
        showToast('Password must be at least 8 characters long.', 'error');
        return;
      }

      // Check if username already exists
      const usernameExists = usersDb.some(u => u.username === username);
      if (usernameExists) {
        showToast('Username already registered.', 'error');
        addLog('REGISTRATION_FAIL', `Username conflict: '${username}' already exists.`, 'warning');
        return;
      }

      // Check if email already exists
      const emailExists = usersDb.some(u => u.email === email);
      if (emailExists) {
        showToast('Email address already registered.', 'error');
        addLog('REGISTRATION_FAIL', `Email conflict: '${email}' already exists.`, 'warning');
        return;
      }

      // Disable button for mock processing time
      registerSubmitBtn.disabled = true;
      registerSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Encrypting...';

      // 2. Encryption & Storage
      try {
        const hashedPassword = await hashPassword(password);
        
        usersDb.push({ username, email, passwordHash: hashedPassword, role });
        localStorage.setItem('usersDb', JSON.stringify(usersDb));

        addLog('REGISTRATION', `New user '${username}' registered with role [${role.toUpperCase()}].`, 'success');
        showToast('Registration successful! Secure hash stored.', 'success');

        // Reset registration fields
        registerForm.reset();
        strengthFill.style.width = '0%';
        strengthLabel.textContent = 'Enter password';

        // Redirect to Login
        setTimeout(() => {
          registerSubmitBtn.disabled = false;
          registerSubmitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Register Securely';
          navigateTo('loginView');
        }, 1000);

      } catch (err) {
        showToast('Encryption process failed.', 'error');
        registerSubmitBtn.disabled = false;
        registerSubmitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Register Securely';
      }
    });
  }

  /* ==========================================================================
     7. Login Controller
     ========================================================================== */
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const loginSubmitBtn = document.getElementById('loginSubmitBtn');

      if (!email || !password) {
        showToast('Please enter both email and password.', 'error');
        return;
      }

      loginSubmitBtn.disabled = true;
      loginSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

      // Hash input password to compare with DB
      const hashedInput = await hashPassword(password);

      // Find user
      const user = usersDb.find(u => u.email === email && u.passwordHash === hashedInput);

      setTimeout(() => {
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';

        if (user) {
          // Success: Store user session details
          sessionStorage.setItem('activeUser', JSON.stringify(user));
          
          addLog('LOGIN_SUCCESS', `User '${user.username}' successfully authenticated.`, 'success');
          showToast(`Welcome back, ${user.username}!`, 'success');
          
          loginForm.reset();
          navigateTo('dashboardView');
        } else {
          // Failure: Alert user & Log incident
          addLog('LOGIN_FAIL', `Failed login attempt for email: '${email}'.`, 'danger');
          showToast('Invalid email or password.', 'error');
        }
      }, 1000);
    });
  }

  /* ==========================================================================
     8. Protected Dashboard & Admin Controller
     ========================================================================== */
  function renderDashboard() {
    const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    if (!activeUser) {
      navigateTo('loginView');
      return;
    }

    // Set Header profile details
    dashUsername.textContent = activeUser.username;
    dashRole.textContent = activeUser.role;
    dashRole.className = `role-badge role-${activeUser.role}`;
    dashAvatar.textContent = activeUser.username.charAt(0).toUpperCase();

    // Toggle Admin Panel features based on role (RBAC)
    if (activeUser.role === 'admin') {
      adminPanel.style.display = 'flex';
      renderUserTable();
      renderLogs();
    } else {
      adminPanel.style.display = 'none';
    }
  }

  // Render the local accounts database for admins
  function renderUserTable() {
    if (!userTableBody) return;
    
    userTableBody.innerHTML = usersDb.map(user => `
      <tr>
        <td style="font-weight:600;">${user.username}</td>
        <td>${user.email}</td>
        <td><span class="role-badge role-${user.role}">${user.role}</span></td>
        <td class="hash-cell" title="${user.passwordHash}">${user.passwordHash}</td>
        <td class="action-cell">
          <button class="delete-user-btn" data-email="${user.email}" title="Delete User">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join('');

    // Attach Delete Action listeners
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const emailToDelete = btn.getAttribute('data-email');
        deleteUser(emailToDelete);
      });
    });
  }

  // Admin Account Deletion logic
  function deleteUser(email) {
    const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    
    // Prevent self deletion
    if (activeUser.email === email) {
      showToast('Action Denied: You cannot delete your own account.', 'error');
      addLog('ADMIN_DENIED', 'Admin attempted to delete their own active account.', 'warning');
      return;
    }

    const userToDelete = usersDb.find(u => u.email === email);
    if (!userToDelete) return;

    // Filter database
    usersDb = usersDb.filter(u => u.email !== email);
    localStorage.setItem('usersDb', JSON.stringify(usersDb));

    addLog('USER_DELETED', `Admin deleted user account '${userToDelete.username}' (${email}).`, 'warning');
    showToast(`User '${userToDelete.username}' deleted successfully.`, 'success');
    renderUserTable();
  }

  // Logout Engine
  logoutBtn.addEventListener('click', () => {
    const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    if (activeUser) {
      addLog('LOGOUT', `User '${activeUser.username}' logged out. Session closed.`, 'info');
    }
    sessionStorage.removeItem('activeUser');
    showToast('Logged out securely.', 'info');
    navigateTo('loginView');
  });

  /* ==========================================================================
     9. Client Toast Alerts
     ========================================================================== */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert-toast toast-${type}`;
    
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-circle-xmark';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass} alert-icon"></i>
      <span class="alert-text">${message}</span>
    `;

    alertContainer.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 4000);
  }

  /* ==========================================================================
     10. Direct Session Route Check on Page Initialization
     ========================================================================== */
  const activeUser = sessionStorage.getItem('activeUser');
  if (activeUser) {
    navigateTo('dashboardView');
  } else {
    navigateTo('loginView');
  }
});
