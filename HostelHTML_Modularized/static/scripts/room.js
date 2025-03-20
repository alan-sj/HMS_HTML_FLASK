// Show alerts
function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alertBox');
    alertBox.className = `alert alert-${type}`;
    alertBox.innerText = message;
    alertBox.classList.remove('d-none');
    setTimeout(() => alertBox.classList.add('d-none'), 3000);
}

// Fetch room and hosteller data
function loadRoomDetails() {
    fetch('/get-room-details')  // Replace with the actual route
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('roomDetailsTable');
            table.innerHTML = '';

            data.forEach(room => {
                const row = `
                    <tr>
                        <td>${room.room_no}</td>
                        <td>${room.hosteller_name}</td>
                        <td>${room.admission_no}</td>
                        <td>${room.capacity}</td>
                        <td>${room.availability}</td>
                    </tr>
                `;
                table.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error fetching room details:', error);
            showAlert('Error fetching room details', 'danger');
        });
}

// Filter room details based on search input
function searchRoom() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#roomDetailsTable tr');

    rows.forEach(row => {
        const roomNo = row.cells[0].innerText.toLowerCase();
        const admission_no  = row.cells[2].innerText.toLowerCase();

        if (roomNo.includes(searchQuery) || admission_no.includes(searchQuery)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add room function
function addRoom(event) {
    event.preventDefault();
   
    const roomNo = document.getElementById('roomNo').value;
    const capacity = document.getElementById('capacity').value;
    
    // Sending room data to server
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
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Room added successfully');
            loadRoomDetails();
        } else {
            showAlert('Error adding room', 'danger');
        }
    })
    .catch(error => {
        console.error('Error adding room:', error);
        showAlert('Error adding room', 'danger');
    });
}

// Delete room function
function deleteRoom(event) {
    event.preventDefault();
    console.log('deleteRoom');
    
    const roomNo = document.getElementById('deleteRoomNo').value;
    
    fetch('/delete-room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            room_no: roomNo
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Room deleted successfully');
            loadRoomDetails();
        } else {
            showAlert('Error deleting room', 'danger');
        }
    })
    .catch(error => {
        console.error('Error deleting room:', error);
        showAlert('Error deleting room', 'danger');
    });
}

// Initialize the page
window.onload = function () {
    loadRoomDetails();
};