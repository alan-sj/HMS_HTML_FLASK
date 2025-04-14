"use strict";

function showAlert(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
  var alertBox = document.getElementById('alertBox');
  alertBox.className = "alert alert-".concat(type);
  alertBox.textContent = message;
  alertBox.classList.remove('d-none');
  setTimeout(function () {
    return alertBox.classList.add('d-none');
  }, 3000);
}

function formatMonthYear(monthValue) {
  if (!monthValue) return null;
  var date = new Date(monthValue + "-01");
  return date instanceof Date && !isNaN(date) ? {
    month: date.getMonth() + 1,
    year: date.getFullYear()
  } : null;
}

function loadFees() {
  var monthInput = document.getElementById('viewMonthSelect').value;

  if (!monthInput) {
    showAlert('Please select a month!', 'danger');
    return;
  }

  var _formatMonthYear = formatMonthYear(monthInput),
      month = _formatMonthYear.month,
      year = _formatMonthYear.year;

  fetch("/fees-info/json?month=".concat(month, "&year=").concat(year)).then(function (response) {
    return response.json();
  }).then(function (data) {
    var table = document.getElementById('feesTable');
    table.innerHTML = "";
    data.forEach(function (student) {
      var row = table.insertRow();
      row.innerHTML = "\n                    <td>".concat(student.admission_no, "</td>\n                    <td>").concat(student.name, "</td>\n                    <td>").concat(student.room_no, "</td>\n                    <td>").concat(student.days_present, "</td>\n                    <td>\u20B9").concat(student.total_fee, "</td>\n                    <td>\u20B9").concat(student.paid_amount, "</td>\n                    <td>\u20B9").concat(student.pending_amount, "</td>\n                    <td>").concat(student.fee_status, "</td>\n                    <td>\n                        <button class=\"btn btn-success btn-sm\" ").concat(student.pending_amount == 0 ? 'disabled' : '', " \n                            onclick=\"markPaid('").concat(student.admission_no, "', ").concat(month, ", ").concat(year, ")\">\n                            Mark Paid\n                        </button>\n                    </td>\n                ");
    });
  });
}

function setFees() {
  var monthInput = document.getElementById('setMonthSelect').value;
  var perDayFee = document.getElementById('perDayFee').value;

  if (!monthInput || !perDayFee) {
    showAlert('Please select a month and enter per day fee!', 'danger');
    return;
  }

  var _formatMonthYear2 = formatMonthYear(monthInput),
      month = _formatMonthYear2.month,
      year = _formatMonthYear2.year;

  fetch('/calculate_fees', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      month: month,
      year: year,
      per_day_fee: perDayFee
    })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    showAlert(data.message);
    loadFees();
  });
}

function markPaid(admission_no, month, year) {
  fetch('/mark_paid', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      admission_no: admission_no,
      month: month,
      year: year
    })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    showAlert(data.message);
    loadFees();
  });
}

function searchStudent() {
  var query = document.getElementById('searchBar').value.toLowerCase();
  var rows = document.querySelectorAll('#feesTable tr');
  rows.forEach(function (row) {
    var admissionNo = row.cells[0].textContent.toLowerCase();
    row.style.display = admissionNo.includes(query) ? '' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('viewMonthSelect').value = new Date().toISOString().slice(0, 7);
  document.getElementById('setMonthSelect').value = new Date().toISOString().slice(0, 7);
  loadFees();
});