// Function to show success/error alerts
function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alertBox');
    alertBox.className = `alert alert-${type}`;
    alertBox.innerText = message;
    alertBox.classList.remove('d-none');
    setTimeout(() => alertBox.classList.add('d-none'), 3000);
}

// Handle Add Staff Form Submission
document.getElementById('staffForm').onsubmit = function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    fetch('/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json())
    .then(data => {
        showAlert(data.message, data.message.includes('successfully') ? 'success' : 'danger');
        if (data.message.includes('successfully')) {
            loadStaff(); // Refresh staff table
            this.reset(); // Clear form
        }
    });
};

// Function to Load Staff Data
function loadStaff() {
    fetch('/staff')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('tbody');
            tableBody.innerHTML = ''; // Clear existing rows
            data.forEach(staff => {
                const row = `
                    <tr>
                        <td>${staff.staff_id}</td>
                        <td>${staff.name}</td>
                        <td>${staff.role}</td>
                        <td>${staff.salary}</td>
                        <td>${staff.date_of_joining}</td>
                        <td>${staff.contact}</td>
                        <td><button class="btn btn-danger btn-sm" onclick="deleteStaff('${staff.staff_id}')">Delete</button></td>
                    </tr>`;
                tableBody.innerHTML += row;
            });
        });
}

// Function to Delete Staff
function deleteStaff(staffId) {
    if (confirm('Are you sure you want to delete this staff?')) {
        fetch(`/staff/${staffId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                showAlert(data.message);
                loadStaff(); // Refresh after deletion
            });
    }
}

// Function to Search Staff by Name
function searchStaff() {
    const query = document.getElementById('searchStaff').value.toLowerCase();
    document.querySelectorAll('tbody tr').forEach(row => {
        const name = row.children[1].innerText.toLowerCase();
        row.style.display = name.includes(query) ? '' : 'none';
    });
}

// Function to Search Staff by Staff ID
function searchStaffID() {
    const query = document.getElementById('searchStaffID').value.toLowerCase();
    document.querySelectorAll('tbody tr').forEach(row => {
        const staffID = row.children[0].innerText.toLowerCase();
        row.style.display = staffID.includes(query) ? '' : 'none';
    });
}

// Auto load staff data on page load
window.onload = loadStaff;