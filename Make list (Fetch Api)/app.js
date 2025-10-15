
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

  //  fetchUsers
  async function fetchUsers() {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await res.json();
      users = data.map(u => ({
        name: u.name,
        email: u.email,
        id: u.id,
        salary: Math.floor(Math.random() * 10000),
        date: '2000-01-01',
      }));
      renderTable();
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  //  Show the Data on table

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
        <td>${u.id}</td>
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

  // Add user button

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const id = document.getElementById('id').value;
    const salary = document.getElementById('salary').value;
    const date = document.getElementById('date').value;

    if (!name || !email || !id || !salary || !date) {
      alert('Please fill all fields!');
      return;
    }

    if (editRow) {
      editRow.children[0].textContent = name;
      editRow.children[1].textContent = email;
      editRow.children[2].textContent = id;
      editRow.children[3].textContent = salary;
      editRow.children[4].textContent = date;
      submitBtn.textContent = '+ Add user';
      editRow = null;
    } else {
      users.push({ name, email, id, salary, date });
      renderTable();
    }
    form.reset();
  });

  // Edit & Delete

  table.addEventListener('click', e => {
    if (e.target.classList.contains('deleteBtn')) {
      e.target.closest('tr').remove();
    }

    if (e.target.classList.contains('editBtn')) {
      editRow = e.target.closest('tr');
      document.getElementById('name').value = editRow.children[0].textContent;
      document.getElementById('email').value = editRow.children[1].textContent;
      document.getElementById('id').value = editRow.children[2].textContent;
      document.getElementById('salary').value = editRow.children[3].textContent;
      document.getElementById('date').value = editRow.children[4].textContent;
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

  syncBtn.addEventListener('click', () => {
    fetchUsers();
  });

  fetchUsers();
});

