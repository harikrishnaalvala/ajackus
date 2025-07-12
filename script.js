let employees = [ 
  { id: "E001", firstName: "Alice", lastName: "Smith", email: "alice@example.com", department: "HR", role: "Manager" },
  { id: "E002", firstName: "Bob", lastName: "Johnson", email: "bob@example.com", department: "IT", role: "Developer" },
  { id: "E003", firstName: "Charlie", lastName: "Lee", email: "charlie@example.com", department: "Finance", role: "Analyst" },
  { id: "E004", firstName: "David", lastName: "Miller", email: "david@example.com", department: "IT", role: "Engineer" },
  { id: "E005", firstName: "Ella", lastName: "Brown", email: "ella@example.com", department: "Marketing", role: "Executive" },
  { id: "E006", firstName: "Frank", lastName: "Wilson", email: "frank@example.com", department: "Sales", role: "Lead" },
  { id: "E007", firstName: "Grace", lastName: "Davis", email: "grace@example.com", department: "Finance", role: "Accountant" },
  { id: "E008", firstName: "Harry", lastName: "Clark", email: "harry@example.com", department: "HR", role: "Recruiter" },
  { id: "E009", firstName: "Isla", lastName: "Lopez", email: "isla@example.com", department: "Operations", role: "Coordinator" },
  { id: "E010", firstName: "Jack", lastName: "Walker", email: "jack@example.com", department: "Support", role: "Technician" }];

const employeeList = document.getElementById('employeeList'); 
const searchInput = document.getElementById('searchInput'); 
const filterBtn = document.getElementById('filterBtn'); 
const addEmpBtn = document.getElementById('addEmpBtn'); 
const addModal = document.getElementById('addModal'); 
const addClose = document.getElementById('addClose');
const addForm = document.getElementById('addForm'); 
const cancelAddBtn = document.getElementById('cancelAddBtn'); 
const sortSelect = document.getElementById('sortSelect'); 
const showSelect = document.getElementById('showSelect'); 
const formErrors = document.getElementById('formErrors');


const filterModal = document.getElementById('filterModal');
const filterClose = document.getElementById('filterClose');
const filterForm = document.getElementById('filterForm');
const cancelFilterBtn = document.getElementById('cancelFilterBtn');
const filterFirstName = document.getElementById('filterFirstName');
const filterDepartment = document.getElementById('filterDepartment');
const filterRole = document.getElementById('filterRole');



filterClose.addEventListener('click', () => {
  filterModal.style.display = 'none'; 
});

cancelFilterBtn.addEventListener('click', () => {
  filterForm.reset(); 
  filterEmployees();
  filterModal.style.display = 'none';
});

window.addEventListener('click', function (event) {
  if (event.target === filterModal) {
    filterModal.style.display = 'none';
  }
});

filterForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const fName = filterFirstName.value.toLowerCase().trim();
  const dept = filterDepartment.value.toLowerCase().trim();
  const role = filterRole.value.toLowerCase().trim();

  filteredEmployees = employees.filter(emp => {
    return (
      (fName === '' || emp.firstName.toLowerCase().includes(fName)) &&
      (dept === '' || emp.department.toLowerCase().includes(dept)) &&
      (role === '' || emp.role.toLowerCase().includes(role))
    );
  });

  filterModal.style.display = 'none'; 
  sortAndRender(); 
});

let filteredEmployees = [...employees]; 
let showCount = parseInt(showSelect.value);
let isDirty = false; 

function renderEmployees(data) {
  employeeList.innerHTML = '';
  if (data.length === 0) {
    employeeList.innerHTML = `<p>No employees found.</p>`;
    return;
  }
  data.slice(0, showCount).forEach(emp => {
    const card = document.createElement('div');
    card.className = 'employee-card';
    card.innerHTML = `
      <div class="emp-info">
        <p><strong>${emp.firstName} ${emp.lastName}</strong></p>
        <p><span>Email:</span> ${emp.email}</p>
        <p><span>Department:</span> ${emp.department}</p>
        <p><span>Role:</span> ${emp.role}</p>
      </div>
      <div class="card-buttons">
        <button class="edit-btn" onclick="editEmployee('${emp.id}')">Edit</button>
        <button class="delete-btn" onclick="deleteEmployee('${emp.id}')">Delete</button>
      </div>
    `;
    employeeList.appendChild(card);
  });
}

function filterEmployees() {
  const query = searchInput.value.toLowerCase().trim();
  filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(query) ||
    emp.lastName.toLowerCase().includes(query) ||
    emp.email.toLowerCase().includes(query)
  );
  sortAndRender();
}

function sortAndRender() {
  const sortBy = sortSelect.value;
  if (sortBy) {
    filteredEmployees.sort((a, b) => {
      if (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) return -1;
      if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
      return 0;
    });
  }
  renderEmployees(filteredEmployees);
}

function deleteEmployee(id) {
  const emp = employees.find(emp => emp.id === id);
  if (!emp) {
    alert('No employee selected or employee does not exist.');
    return;
  }

  if (confirm(`Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`)) {
    employees = employees.filter(emp => emp.id !== id);
    filterEmployees(); 
  }
}

function editEmployee(id) {
  if (isDirty && !confirm("You have unsaved changes. Continue without saving?")) return;
  const emp = employees.find(e => e.id === id);
  if (!emp) {
    alert('Employee not found.');
    return;
  }
  openAddModal(true, emp);
  isDirty = false;
}

function openAddModal(isEdit = false, employee = null) {
  addModal.style.display = 'flex';
  formErrors.innerHTML = '';
  if (isEdit) {
    addForm.dataset.editing = employee.id;
    addForm['addFirstName'].value = employee.firstName;
    addForm['addLastName'].value = employee.lastName;
    addForm['addEmail'].value = employee.email;
    addForm['addDepartment'].value = employee.department;
    addForm['addRole'].value = employee.role;
  } else {
    addForm.removeAttribute('data-editing');
    addForm.reset();
  }
  isDirty = false;
}

function closeAddModal() {
  if (isDirty && !confirm("You have unsaved changes. Are you sure you want to discard them?")) return;
  addModal.style.display = 'none';
  addForm.reset();
  formErrors.innerHTML = '';
  isDirty = false;
}

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function generateNewId() {
  let maxId = 0;
  employees.forEach(emp => {
    const num = parseInt(emp.id.replace(/[^\\d]/g, ''), 10);
    if (num > maxId) maxId = num;
  });
  return 'E' + String(maxId + 1).padStart(3, '0');
}

addForm.addEventListener('submit', function(e) {
  e.preventDefault();
  formErrors.innerHTML = '';

  const idEditing = addForm.dataset.editing;
  const firstName = addForm['addFirstName'].value.trim();
  const lastName = addForm['addLastName'].value.trim();
  const email = addForm['addEmail'].value.trim();
  const department = addForm['addDepartment'].value;
  const role = addForm['addRole'].value.trim();

  let errors = [];
  if (!firstName) errors.push('First name is required.');
  if (!lastName) errors.push('Last name is required.');
  if (!email) errors.push('Email is required.');
  else if (!validateEmail(email)) errors.push('Please enter a valid email.');
  if (!department) errors.push('Please select a department.');
  if (!role) errors.push('Role is required.');

  if (errors.length > 0) {
    formErrors.innerHTML = errors.join('<br>');
    return;
  }

  if (idEditing) {
    const empIndex = employees.findIndex(e => e.id === idEditing);
    if (empIndex !== -1) {
      employees[empIndex] = { id: idEditing, firstName, lastName, email, department, role };
    } else {
      formErrors.innerHTML = 'Error: Employee to edit not found.';
      return;
    }
  } else {
    const newId = generateNewId();
    employees.push({ id: newId, firstName, lastName, email, department, role });
  }

  isDirty = false; 
  closeAddModal();
  filterEmployees();
});

addForm.addEventListener('input', () => {
  isDirty = true;
});

searchInput.addEventListener('input', filterEmployees);
addEmpBtn.addEventListener('click', () => openAddModal());
addClose.addEventListener('click', closeAddModal);
cancelAddBtn.addEventListener('click', closeAddModal);
sortSelect.addEventListener('change', sortAndRender);
showSelect.addEventListener('change', () => {
  showCount = parseInt(showSelect.value);
  renderEmployees(filteredEmployees);
});

window.onclick = function(event) {
  if (event.target === addModal) {
    closeAddModal();
  }
};

filterEmployees();
