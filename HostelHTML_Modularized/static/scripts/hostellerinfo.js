function showAlert(m, t = 'success') {
    const a = document.getElementById('alertBox');
    a.className = `alert alert-${t}`;
    a.classList.remove('d-none');
    a.innerText = m;
    setTimeout(() => a.classList.add('d-none'), 3000);
}

document.getElementById('hostellerForm').onsubmit = function(e) {
    e.preventDefault();
    
    // Get form data
    let formData = Object.fromEntries(new FormData(this));
    console.log("Form Data:", formData);

    fetch('/hosteller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)  // Send JSON to backend
    })
    .then(response => response.json())
    .then(data => {
        showAlert(data.message);
        loadHostellers();
        this.reset();
    });
};

function loadHostellers() {
    fetch('/hostellers')
    .then(r => r.json())
    .then(data => {
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
        data.forEach(h => {
            tbody.innerHTML += `
                <tr>
                    <td>${h.name}</td>
                    <td>${h.room_no}</td>
                    <td>${h.admission_no}</td>
                    <td>${h.date_of_admission}</td>
                    <td>${h.contact}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteHosteller(${h.hosteller_id})">
                            Delete
                        </button>
                    </td>
                </tr>`;
        });
    });
}

function deleteHosteller(id) {
    if (confirm("Are you sure?")) {
        fetch('/hosteller/' + id, { method: 'DELETE' })
        .then(r => r.json())
        .then(d => {
            showAlert(d.message);
            loadHostellers();
        });
    }
}

function searchHosteller() {
    const q = document.getElementById('searchHosteller').value.toLowerCase();
    document.querySelectorAll('tbody tr').forEach(r => {
        r.style.display = r.children[0].innerText.toLowerCase().includes(q) ? '' : 'none';
    });
}

function searchAdmission() {
    const q = document.getElementById('searchAdmission').value.toLowerCase();
    document.querySelectorAll('tbody tr').forEach(r => {
        r.style.display = r.children[2].innerText.toLowerCase().includes(q) ? '' : 'none';
    });
}

window.onload = loadHostellers;
