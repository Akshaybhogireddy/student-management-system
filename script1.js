const form = document.getElementById("student-form");
const tableBody = document.getElementById("student-table-body");
const searchInput = document.getElementById("search");
const darkToggle = document.getElementById("dark-mode-toggle");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const branch = document.getElementById("branch").value.trim();

  if (!name || !roll || !branch) {
    alert("Please fill all fields.");
    return;
  }

  addStudentToTable({ name, roll, branch });
  form.reset();
  saveToLocalStorage();
});

function addStudentToTable(student) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td class="name">${student.name}</td>
    <td class="roll">${student.roll}</td>
    <td class="branch">${student.branch}</td>
    <td>
      <button onclick="editRow(this)">Edit</button>
      <button onclick="deleteRow(this)">Delete</button>
    </td>
  `;

  tableBody.appendChild(row);
}

function deleteRow(btn) {
  if (confirm("Are you sure you want to delete this student?")) {
    btn.closest("tr").remove();
    saveToLocalStorage();
  }
}

function editRow(btn) {
  const row = btn.closest("tr");
  const nameCell = row.querySelector(".name");
  const rollCell = row.querySelector(".roll");
  const branchCell = row.querySelector(".branch");

  const newName = prompt("Edit Name:", nameCell.textContent);
  if (newName === null || newName.trim() === "") return;

  const newRoll = prompt("Edit Roll No:", rollCell.textContent);
  if (newRoll === null || newRoll.trim() === "") return;

  const newBranch = prompt("Edit Branch:", branchCell.textContent);
  if (newBranch === null || newBranch.trim() === "") return;

  nameCell.textContent = newName.trim();
  rollCell.textContent = newRoll.trim();
  branchCell.textContent = newBranch.trim();

  saveToLocalStorage();
}

function filterStudents() {
  const query = searchInput.value.toLowerCase();
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const nameText = row.querySelector(".name").textContent.toLowerCase();
    row.style.display = nameText.includes(query) ? "" : "none";
  });
}

function exportToCSV() {
  let csv = "Name,Roll No,Branch\n";
  tableBody.querySelectorAll("tr").forEach((row) => {
    const name = row.querySelector(".name").textContent;
    const roll = row.querySelector(".roll").textContent;
    const branch = row.querySelector(".branch").textContent;
    csv += `${name},${roll},${branch}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "students.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function saveToLocalStorage() {
  const students = [];
  tableBody.querySelectorAll("tr").forEach((row) => {
    students.push({
      name: row.querySelector(".name").textContent,
      roll: row.querySelector(".roll").textContent,
      branch: row.querySelector(".branch").textContent,
    });
  });
  localStorage.setItem("students", JSON.stringify(students));
}

function loadFromLocalStorage() {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  students.forEach((student) => addStudentToTable(student));
}

darkToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", darkToggle.checked);
});

window.addEventListener("load", () => {
  loadFromLocalStorage();
});
