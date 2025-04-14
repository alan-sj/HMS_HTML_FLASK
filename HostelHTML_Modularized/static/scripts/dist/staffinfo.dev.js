"use strict";

// Function to show success/error alerts
function showAlert(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
  var alertBox = document.getElementById('alertBox');
  alertBox.className = "alert alert-".concat(type);
  alertBox.innerText = message;
  alertBox.classList.remove('d-none');
  setTimeout(function () {
    return alertBox.classList.add('d-none');
  }, 3000);
} // Handle Add Staff Form Submission


document.getElementById('staffForm').onsubmit = function (event) {
  var _this = this;

  event.preventDefault();
  var formData = new FormData(this);
  fetch('/staff', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(formData))
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    showAlert(data.message, data.message.includes('successfully') ? 'success' : 'danger');

    if (data.message.includes('successfully')) {
      loadStaff(); // Refresh staff table

      _this.reset(); // Clear form

    }
  });
}; // Function to Load Staff Data


function loadStaff() {
  fetch('/staff').then(function (response) {
    return response.json();
  }).then(function (data) {
    var tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach(function (staff) {
      var row = "\n                    <tr>\n                        <td>".concat(staff.staff_id, "</td>\n                        <td>").concat(staff.name, "</td>\n                        <td>").concat(staff.role, "</td>\n                        <td>").concat(staff.salary, "</td>\n                        <td>").concat(staff.date_of_joining, "</td>\n                        <td>").concat(staff.contact, "</td>\n                        <td><button class=\"btn btn-danger btn-sm\" onclick=\"deleteStaff('").concat(staff.staff_id, "')\">Delete</button></td>\n                    </tr>");
      tableBody.innerHTML += row;
    });
  });
} // Function to Delete Staff


function deleteStaff(staffId) {
  if (confirm('Are you sure you want to delete this staff?')) {
    fetch("/staff/".concat(staffId), {
      method: 'DELETE'
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      showAlert(data.message);
      loadStaff(); // Refresh after deletion
    });
  }
} // Function to Search Staff by Name


function searchStaff() {
  var query = document.getElementById('searchStaff').value.toLowerCase();
  document.querySelectorAll('tbody tr').forEach(function (row) {
    var name = row.children[1].innerText.toLowerCase();
    row.style.display = name.includes(query) ? '' : 'none';
  });
} // Function to Search Staff by Staff ID


function searchStaffID() {
  var query = document.getElementById('searchStaffID').value.toLowerCase();
  document.querySelectorAll('tbody tr').forEach(function (row) {
    var staffID = row.children[0].innerText.toLowerCase();
    row.style.display = staffID.includes(query) ? '' : 'none';
  });
} // Auto load staff data on page load


window.onload = loadStaff;