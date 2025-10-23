// -------------------- ADMIN LOGIN --------------------
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(adminLoginForm).entries());

    const res = await fetch('/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    const msg = document.getElementById('message');
    if (result.success) {
      msg.textContent = 'Login successful!';
      msg.style.color = 'green';
      // save admin_id if needed
      localStorage.setItem('admin_id', result.admin_id);
      window.location.href = './admin_dashboard.html';
    } else {
      msg.textContent = result.message || 'Login failed!';
      msg.style.color = 'red';
    }
  });
}

// -------------------- ADMIN SIGNUP --------------------
const adminSignupForm = document.getElementById('adminSignupForm');
if (adminSignupForm) {
  adminSignupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(adminSignupForm).entries());

    const res = await fetch('/admin-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    const msg = document.getElementById('message');
    if (result.success) {
      msg.textContent = 'Admin registered successfully!';
      msg.style.color = 'green';
      adminSignupForm.reset();
    } else {
      msg.textContent = result.message || 'Registration failed!';
      msg.style.color = 'red';
    }
  });
}

// -------------------- STUDENT SIGNUP --------------------
const studentSignupForm = document.getElementById('studentSignupForm');
if (studentSignupForm) {
  studentSignupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(studentSignupForm).entries());

    const res = await fetch('/student-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    const msg = document.getElementById('message');
    if (result.success) {
      msg.textContent = 'Student registered successfully!';
      msg.style.color = 'green';
      studentSignupForm.reset();
      window.location.href = './student_login.html'; // redirect to login if created
    } else {
      msg.textContent = result.message || 'Registration failed!';
      msg.style.color = 'red';
    }
  });
}

// -------------------- STUDENT LOGIN --------------------
const studentLoginForm = document.getElementById('studentLoginForm');
if (studentLoginForm) {
  studentLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(studentLoginForm).entries());

    const res = await fetch('/student-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    const msg = document.getElementById('message');
    if (result.success) {
      msg.textContent = `Login successful! Welcome, ${result.name}`;
      msg.style.color = 'green';
      localStorage.setItem('student_id', result.student_id);
      window.location.href = './student_dashboard.html';
    } else {
      msg.textContent = result.message || 'Login failed!';
      msg.style.color = 'red';
    }
  });
}

// -------------------- STUDENT COMPLAINT SUBMISSION --------------------
const complaintForm = document.getElementById('complaintForm');
if (complaintForm) {
  complaintForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const student_id = localStorage.getItem('student_id');
    if (!student_id) {
      alert('Please login first!');
      window.location.href = './student_login.html';
      return;
    }

    const formData = Object.fromEntries(new FormData(complaintForm).entries());
    formData.student_id = student_id;

    const res = await fetch('/submit-complaint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await res.json();
    const msg = document.getElementById('message');
    if (result.success) {
      msg.textContent = 'Complaint submitted successfully!';
      msg.style.color = 'green';
      complaintForm.reset();
    } else {
      msg.textContent = 'Error submitting complaint.';
      msg.style.color = 'red';
    }
  });
}

// -------------------- ADMIN DASHBOARD (VIEW COMPLAINTS) --------------------
const complaintsTable = document.getElementById('complaintsTable');
if (complaintsTable) {
  fetch('/all-complaints')
    .then(res => res.json())
    .then(data => {
      data.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.id}</td>
          <td>${c.name}</td>
          <td>${c.roll_no}</td>
          <td>${c.complaint_type}</td>
          <td>${c.complaint_text}</td>
          <td>${c.status}</td>
          <td>${new Date(c.date).toLocaleString()}</td>
        `;
        complaintsTable.appendChild(tr);
      });
    });
}
