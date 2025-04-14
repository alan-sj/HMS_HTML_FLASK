"use strict";

// Show alerts
function showAlert(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
  var alertBox = document.getElementById('alertBox');
  alertBox.className = "alert alert-".concat(type);
  alertBox.innerText = message;
  alertBox.classList.remove('d-none');
  setTimeout(function () {
    return alertBox.classList.add('d-none');
  }, 3000);
} // Populate month dropdown


function populateMonths() {
  var monthSelect = document.getElementById('monthSelect');
  var currentDate = new Date();

  for (var i = 0; i < 12; i++) {
    var month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    var option = document.createElement('option');
    option.value = "".concat(month.getFullYear(), "-").concat(String(month.getMonth() + 1).padStart(2, '0'));
    option.text = month.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });
    monthSelect.appendChild(option);
  }
} // Load students for selected month


function loadStudents() {
  var selectedMonth = document.getElementById('monthSelect').value;
  fetch("/attendance-info/json?month=".concat(selectedMonth)).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log("Attendance Data:", data);
    var table = document.getElementById('attendanceTable');
    table.innerHTML = '';
    data.forEach(function (student) {
      var row = "\n                    <tr>\n                        <td>".concat(student.admission_no, "</td>\n                        <td>").concat(student.name, "</td>\n                        <td>").concat(student.days_present, "</td>\n                        <td><input type=\"checkbox\" class=\"form-check-input\" data-admission-no=\"").concat(student.admission_no, "\"></td>\n                    </tr>");
      table.innerHTML += row;
    });
  })["catch"](function (error) {
    return console.error('Error loading students:', error);
  });
} // Toggle All Checkboxes


function toggleAll(source) {
  var checkboxes = document.querySelectorAll('#attendanceTable input[type="checkbox"]');
  checkboxes.forEach(function (checkbox) {
    return checkbox.checked = source.checked;
  });
} // Search students by name or admission number


function searchStudent() {
  var query = document.getElementById('searchStudent').value.toLowerCase();
  document.querySelectorAll('#attendanceTable tr').forEach(function (row) {
    var admissionNo = row.children[0].innerText.toLowerCase();
    var name = row.children[1].innerText.toLowerCase();
    row.style.display = admissionNo.includes(query) || name.includes(query) ? '' : 'none';
  });
} // Submit Attendance (increase days_present count)


function submitAttendance() {
  var selectedMonth = document.getElementById('monthSelect').value;
  var selectedStudents = [];
  document.querySelectorAll('#attendanceTable input[type="checkbox"]:checked').forEach(function (checkbox) {
    selectedStudents.push({
      admission_no: checkbox.dataset.admissionNo,
      month: selectedMonth
    });
  });

  if (selectedStudents.length === 0) {
    showAlert('No students selected!', 'danger');
    return;
  }

  fetch('/attendance/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selectedStudents)
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    showAlert(data.message, 'success');
    loadStudents(); // Reload student list
  })["catch"](function (error) {
    return console.error('Error updating attendance:', error);
  });
} // Initialize page


window.onload = function () {
  populateMonths();
  loadStudents();
};