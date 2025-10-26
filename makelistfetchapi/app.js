document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userForm');
  const table = document.querySelector('#userTable tbody');
  const search = document.getElementById('searchInput');
  const submitBtn = document.getElementById('submitBtn');
  const syncBtn = document.querySelector('.user-button');

  let editRow = null;
  let users = [];
  let currentPage = 1;
  const rowsPerPage = 3;

  let apiUrl = 'http://localhost/makelistfetchapi/index.php';

  // Fetch users from DB
  async function fetchUsers() {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      users = data.map(u => ({
        name: u.name,
        email: u.email,
        salary: u.salary,
        date: u.date,
      }));
      renderTable();
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  // Render table
  function renderTable() {
    table.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageUsers = users.slice(start, end);

    pageUsers.forEach(u => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.salary}</td>
        <td>${u.date}</td>
        <td>
          <button class="editBtn">Edit</button>
          <button class="deleteBtn">Delete</button>
        </td>
      `;
      table.appendChild(row);
    });
  }

  // Pagination
  window.next = function () {
    if (currentPage * rowsPerPage < users.length) {
      currentPage++;
      renderTable();
    }
  };

  window.prev = function () {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  };

  // Add / Update User
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const salary = document.getElementById('salary').value;
    const date = document.getElementById('date').value;

    if (!name || !email || !salary || !date) {
      alert('Please fill all fields!');
      return;
    }

    try {
      if (editRow) {
        // Update existing user
        const updatedUser = { name, email, salary, date };

        console.log('Sending data:', updatedUser);

        const res = await fetch(apiUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
        const data = await res.json();

        console.log('Response:', data);

        alert(data.message || 'User updated');

        // Update browser memory
        const index = users.findIndex(u => u.email === email);
        if (index !== -1) users[index] = updatedUser;

        editRow = null;
        submitBtn.textContent = '+ Add user';
      } else {
        // Add new user
        const newUser = { name, email, salary, date };

        console.log('Sending data:', newUser);

        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });
        const data = await res.json();

        console.log('Response:', data);

        alert(data.message || 'User added');

        if (data.status) {
          users.push(newUser);
        }
      }

      form.reset();
      renderTable();
    } catch (err) {
      console.error('Error sending data:', err);
      alert('Error sending data to server');
    }
  });

  // Edit / Delete
  table.addEventListener('click', async e => {
    const row = e.target.closest('tr');
    if (!row) return;
    const email = row.children[1].textContent;

    if (e.target.classList.contains('deleteBtn')) {
      if (confirm('Are you sure to delete this user?')) {
        try {
          const res = await fetch(
            `http://localhost/makelistfetchapi/index.php?email=${encodeURIComponent(
              email
            )}`,
            {
              method: 'DELETE',
            }
          );
          const data = await res.json();
          alert(data.message || 'User deleted');

          users = users.filter(u => u.email !== email);
          renderTable();
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      }
    }

    if (e.target.classList.contains('editBtn')) {
      editRow = row;
      document.getElementById('name').value = row.children[0].textContent;
      document.getElementById('email').value = row.children[1].textContent;
      document.getElementById('salary').value = row.children[2].textContent;
      document.getElementById('date').value = row.children[3].textContent;
      submitBtn.textContent = 'Update User';
    }
  });

  // Search
  search.addEventListener('input', () => {
    const filter = search.value.toLowerCase();
    const rows = table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const text = rows[i].textContent.toLowerCase();
      rows[i].style.display = text.includes(filter) ? '' : 'none';
    }
  });

  // Sync Button
  syncBtn.addEventListener('click', fetchUsers);

  // Initial Load
  fetchUsers();
});
