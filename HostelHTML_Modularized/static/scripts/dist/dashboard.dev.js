"use strict";

fetch('/dashboard-info').then(function (response) {
  return response.json();
}).then(function (data) {
  // Get total beds and available beds
  var availableBeds = data.available_beds;
  var totalBeds = data.total_beds;
  var occupiedBeds = totalBeds - availableBeds; // Calculate percentages

  var availablePercentage = (availableBeds / totalBeds * 100).toFixed(2);
  var occupiedPercentage = (occupiedBeds / totalBeds * 100).toFixed(2); // Set available and occupied bed percentages

  document.getElementById('availableBeds').textContent = "".concat(availablePercentage, "%");
  document.getElementById('occupiedBeds').textContent = "".concat(occupiedPercentage, "%"); // Set total students and staff

  document.getElementById('totalStudents').textContent = data.total_students;
  document.getElementById('totalStaff').textContent = data.total_staff; // Set up the chart

  var ctx = document.getElementById('roomChart').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Available Beds', 'Occupied Beds'],
      datasets: [{
        label: 'Room Availability',
        data: [availablePercentage, occupiedPercentage],
        backgroundColor: ['#4caf50', '#f44336'],
        borderColor: ['#4caf50', '#f44336'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function label(tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
            }
          }
        }
      }
    }
  });
});