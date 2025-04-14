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
} // Fetch room and hosteller data


function loadRoomDetails() {
  fetch('/get-room-details') // Replace with the actual route
  .then(function (response) {
    return response.json();
  }).then(function (data) {
    var table = document.getElementById('roomDetailsTable');
    table.innerHTML = '';
    data.forEach(function (room) {
      var row = "\n                    <tr>\n                        <td>".concat(room.room_no, "</td>\n                        <td>").concat(room.hosteller_name, "</td>\n                        <td>").concat(room.admission_no, "</td>\n                        <td>").concat(room.capacity, "</td>\n                        <td>").concat(room.availability, "</td>\n                    </tr>\n                ");
      table.innerHTML += row;
    });
  })["catch"](function (error) {
    console.error('Error fetching room details:', error);
    showAlert('Error fetching room details', 'danger');
  });
} // Filter room details based on search input


function searchRoom() {
  var searchQuery = document.getElementById('searchInput').value.toLowerCase();
  var rows = document.querySelectorAll('#roomDetailsTable tr');
  rows.forEach(function (row) {
    var roomNo = row.cells[0].innerText.toLowerCase();
    var admission_no = row.cells[2].innerText.toLowerCase();

    if (roomNo.includes(searchQuery) || admission_no.includes(searchQuery)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
} // Add room function


function addRoom(event) {
  event.preventDefault();
  var roomNo = document.getElementById('roomNo').value;
  var capacity = document.getElementById('capacity').value; // Sending room data to server

  fetch('/add-room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      room_no: roomNo,
      capacity: capacity,
      availability: 0
    })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.success) {
      showAlert('Room added successfully');
      loadRoomDetails();
    } else {
      showAlert('Error adding room', 'danger');
    }
  })["catch"](function (error) {
    console.error('Error adding room:', error);
    showAlert('Error adding room', 'danger');
  });
} // Delete room function


function deleteRoom(event) {
  event.preventDefault();
  console.log('deleteRoom');
  var roomNo = document.getElementById('deleteRoomNo').value;
  fetch('/delete-room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      room_no: roomNo
    })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.success) {
      showAlert('Room deleted successfully');
      loadRoomDetails();
    } else {
      showAlert('Error deleting room', 'danger');
    }
  })["catch"](function (error) {
    console.error('Error deleting room:', error);
    showAlert('Error deleting room', 'danger');
  });
} // Initialize the page


window.onload = function () {
  loadRoomDetails();
};