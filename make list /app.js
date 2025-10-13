document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userForm');
  const table = document.querySelector('#userTable');
  const search = document.getElementById('searchInput');
  const submitBtn = document.getElementById('submitBtn');

  let editRow = null;

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
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${name}</td>
        <td>${email}</td>
        <td>${id}</td>
        <td>${salary}</td>
        <td>${date}</td>
        <td>
          <button class="editBtn">Edit</button>
          <button class="deleteBtn">Delete</button>
        </td>
      `;
      table.appendChild(row);
    }
    form.reset();
  });

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

  search.addEventListener('input', () => {
    const filter = search.value.toLowerCase();
    const rows = table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const text = rows[i].textContent.toLowerCase();
      rows[i].style.display = text.includes(filter) ? '' : 'none'
    }

  });
});




