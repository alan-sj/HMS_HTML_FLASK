"use strict";

function showAlert(m) {
  var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
  var a = document.getElementById('alertBox');
  a.className = "alert alert-".concat(t);
  a.innerText = m;
  a.classList.remove('d-none');
  setTimeout(function () {
    return a.classList.add('d-none');
  }, 3000);
}

document.getElementById('hostellerForm').onsubmit = function (e) {
  var _this = this;

  e.preventDefault(); // Get form data

  var formData = Object.fromEntries(new FormData(this)); // Debugging: Check if "status" is mistakenly included

  console.log("Form Data:", formData);
  fetch('/hosteller', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData) // Send JSON to backend

  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    showAlert(data.message, data.message.includes('successfully') ? 'success' : 'danger');
    loadHostellers();

    _this.reset();
  });
};

function loadHostellers() {
  fetch('/hostellers').then(function (r) {
    return r.json();
  }).then(function (data) {
    var tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    data.forEach(function (h) {
      tbody.innerHTML += "\n                <tr>\n                    <td>".concat(h.name, "</td>\n                    <td>").concat(h.room_no, "</td>\n                    <td>").concat(h.admission_no, "</td>\n                    <td>").concat(h.date_of_admission, "</td>\n                    <td>").concat(h.contact, "</td>\n                    <td>\n                        <button class=\"btn btn-danger btn-sm\" onclick=\"deleteHosteller(").concat(h.hosteller_id, ")\">\n                            Delete\n                        </button>\n                    </td>\n                </tr>");
    });
  });
}

function deleteHosteller(id) {
  if (confirm("Are you sure?")) {
    fetch('/hosteller/' + id, {
      method: 'DELETE'
    }).then(function (r) {
      return r.json();
    }).then(function (d) {
      showAlert(d.message);
      loadHostellers();
    });
  }
}

function searchHosteller() {
  var q = document.getElementById('searchHosteller').value.toLowerCase();
  document.querySelectorAll('tbody tr').forEach(function (r) {
    r.style.display = r.children[0].innerText.toLowerCase().includes(q) ? '' : 'none';
  });
}

function searchAdmission() {
  var q = document.getElementById('searchAdmission').value.toLowerCase();
  document.querySelectorAll('tbody tr').forEach(function (r) {
    r.style.display = r.children[2].innerText.toLowerCase().includes(q) ? '' : 'none';
  });
}

window.onload = loadHostellers;