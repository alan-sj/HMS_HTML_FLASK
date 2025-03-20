// Show alerts
function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alertBox');
    alertBox.className = `alert alert-${type}`;
    alertBox.innerText = message;
    alertBox.classList.remove('d-none');
    setTimeout(() => alertBox.classList.add('d-none'), 3000);
}

// Populate month dropdown
function populateMonths() {
    const monthSelect = document.getElementById('monthSelect');
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const option = document.createElement('option');
        option.value = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
        option.text = month.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthSelect.appendChild(option);
    }
}

// Load students for selected month
function loadStudents() {
    const selectedMonth = document.getElementById('monthSelect').value;
    
    fetch(`/attendance-info/json?month=${selectedMonth}`)
        .then(response => response.json())
        .then(data => {
            console.log("Attendance Data:", data);

            const table = document.getElementById('attendanceTable');
            table.innerHTML = ''; 

            data.forEach(student => {
                const row = `
                    <tr>
                        <td>${student.admission_no}</td>
                        <td>${student.name}</td>
                        <td>${student.days_present}</td>
                        <td><input type="checkbox" class="form-check-input" data-admission-no="${student.admission_no}"></td>
                    </tr>`;
                table.innerHTML += row;
            });
        })
        .catch(error => console.error('Error loading students:', error));
}

// Toggle All Checkboxes
function toggleAll(source) {
    const checkboxes = document.querySelectorAll('#attendanceTable input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = source.checked);
}

// Search students by name or admission number
function searchStudent() {
    const query = document.getElementById('searchStudent').value.toLowerCase();
    document.querySelectorAll('#attendanceTable tr').forEach(row => {
        const admissionNo = row.children[0].innerText.toLowerCase();
        const name = row.children[1].innerText.toLowerCase();
        row.style.display = admissionNo.includes(query) || name.includes(query) ? '' : 'none';
    });
}

// Submit Attendance (increase days_present count)
function submitAttendance() {
    const selectedMonth = document.getElementById('monthSelect').value;
    const selectedStudents = [];
    document.querySelectorAll('#attendanceTable input[type="checkbox"]:checked').forEach(checkbox => {
        selectedStudents.push({ admission_no: checkbox.dataset.admissionNo, month: selectedMonth });
    });

    if (selectedStudents.length === 0) {
        showAlert('No students selected!', 'danger');
        return;
    }

    fetch('/attendance/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedStudents)
    })
    .then(response => response.json())
    .then(data => {
        showAlert(data.message, 'success');
        loadStudents(); // Reload student list
    })
    .catch(error => console.error('Error updating attendance:', error));
}

// Initialize page
window.onload = function () {
    populateMonths();
    loadStudents();
};
