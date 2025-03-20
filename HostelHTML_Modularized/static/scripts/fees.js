function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alertBox');
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
    alertBox.classList.remove('d-none');
    setTimeout(() => alertBox.classList.add('d-none'), 3000);
}

function formatMonthYear(monthValue) {
    if (!monthValue) return null;
    const date = new Date(monthValue + "-01");
    return date instanceof Date && !isNaN(date) ? { month: date.getMonth() + 1, year: date.getFullYear() } : null;
}

function loadFees() {
    const monthInput = document.getElementById('viewMonthSelect').value;
    if (!monthInput) {
        showAlert('Please select a month!', 'danger');
        return;
    }

    const { month, year } = formatMonthYear(monthInput);

    fetch(`/fees-info/json?month=${month}&year=${year}`)
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('feesTable');
            table.innerHTML = "";

            data.forEach(student => {
                const row = table.insertRow();
                row.innerHTML = `
                    <td>${student.admission_no}</td>
                    <td>${student.name}</td>
                    <td>${student.room_no}</td>
                    <td>${student.days_present}</td>
                    <td>₹${student.total_fee}</td>
                    <td>₹${student.paid_amount}</td>
                    <td>₹${student.pending_amount}</td>
                    <td>${student.fee_status}</td>
                    <td>
                        <button class="btn btn-success btn-sm" ${student.pending_amount == 0 ? 'disabled' : ''} 
                            onclick="markPaid('${student.admission_no}', ${month}, ${year})">
                            Mark Paid
                        </button>
                    </td>
                `;
            });
        });
}

function setFees() {
    const monthInput = document.getElementById('setMonthSelect').value;
    const perDayFee = document.getElementById('perDayFee').value;

    if (!monthInput || !perDayFee) {
        showAlert('Please select a month and enter per day fee!', 'danger');
        return;
    }

    const { month, year } = formatMonthYear(monthInput);

    fetch('/calculate_fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, year, per_day_fee: perDayFee })
    })
    .then(response => response.json())
    .then(data => {
        showAlert(data.message);
        loadFees();
    });
}

function markPaid(admission_no, month, year) {
    fetch('/mark_paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admission_no, month, year })
    })
    .then(response => response.json())
    .then(data => {
        showAlert(data.message);
        loadFees();
    });
}

function searchStudent() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const rows = document.querySelectorAll('#feesTable tr');

    rows.forEach(row => {
        const admissionNo = row.cells[0].textContent.toLowerCase();
        row.style.display = admissionNo.includes(query) ? '' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('viewMonthSelect').value = new Date().toISOString().slice(0, 7);
    document.getElementById('setMonthSelect').value = new Date().toISOString().slice(0, 7);
    loadFees();
});