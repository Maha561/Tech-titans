// Users
const users = [
  {username: 'student1', password: 'pass', role: 'student'},
  {username: 'staff1', password: 'pass', role: 'staff'},
  {username: 'admin1', password: 'pass', role: 'admin'}
];

let currentUser = null;
let complaints = [];
let feedbacks = [];

// Login
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  const user = users.find(u => u.username === username && u.password === password && u.role === role);

  if (user) {
    currentUser = user;
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('hidden');
    document.getElementById('welcome-msg').innerText = `Welcome ${currentUser.role.toUpperCase()} ${currentUser.username}`;

    // Show sections based on role
    if (role === 'student' || role === 'staff') {
      document.getElementById('complaint-form').classList.remove('hidden');
      document.getElementById('feedback-section').classList.remove('hidden');
    }
    if (role === 'admin') {
      document.getElementById('dashboard-analysis').classList.remove('hidden');
    }

    updateDashboard();
    notify(`${currentUser.role} logged in successfully`);
  } else {
    alert('Invalid credentials!');
  }
}

// Logout
function logout() {
  currentUser = null;
  document.getElementById('login-container').classList.remove('hidden');
  document.getElementById('dashboard-container').classList.add('hidden');
  alert('Logged out successfully');
}

// Submit Complaint
function submitComplaint() {
  const category = document.getElementById('category').value;
  const priority = document.getElementById('priority').value;
  const text = document.getElementById('complaint-text').value;

  if (!text) return alert('Enter complaint text');

  const complaint = {
    id: Date.now(),
    user: currentUser.username,
    category,
    priority,
    text,
    status: 'Pending'
  };
  complaints.push(complaint);
  document.getElementById('complaint-text').value = '';
  updateDashboard();
  notify('Complaint submitted successfully');
}

// Submit Feedback
function submitFeedback() {
  const text = document.getElementById('feedback-text').value;
  const rating = document.getElementById('rating').value;

  if (!text) return alert('Enter feedback');

  feedbacks.push({user: currentUser.username, text, rating});
  document.getElementById('feedback-text').value = '';
  notify('Feedback submitted successfully');
}

// Update Dashboard
function updateDashboard() {
  const ul = document.getElementById('complaints-ul');
  ul.innerHTML = '';
  
  complaints.forEach(c => {
    const li = document.createElement('li');
    li.innerText = `[${c.status}] ${c.user} - ${c.category} (${c.priority}) : ${c.text}`;
    ul.appendChild(li);
  });

  if (currentUser.role === 'admin') {
    document.getElementById('total-complaints').innerText = complaints.length;

    // Category Analysis
    const catAnalysis = {};
    const priorityAnalysis = {};
    complaints.forEach(c => {
      catAnalysis[c.category] = (catAnalysis[c.category] || 0) + 1;
      priorityAnalysis[c.priority] = (priorityAnalysis[c.priority] || 0) + 1;
    });

    const catUl = document.getElementById('category-analysis');
    catUl.innerHTML = '';
    for (let cat in catAnalysis) {
      const li = document.createElement('li');
      li.innerText = `${cat}: ${catAnalysis[cat]}`;
      catUl.appendChild(li);
    }

    const prUl = document.getElementById('priority-analysis');
    prUl.innerHTML = '';
    for (let pr in priorityAnalysis) {
      const li = document.createElement('li');
      li.innerText = `${pr}: ${priorityAnalysis[pr]}`;
      prUl.appendChild(li);
    }
  }
}

// Notification
function notify(message) {
  if (Notification.permission === 'granted') {
    new Notification(message);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') new Notification(message);
    });
  }
}
