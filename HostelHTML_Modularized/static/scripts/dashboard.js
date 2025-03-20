fetch('/dashboard-info')
            .then(response => response.json())
            .then(data => {
                // Get total beds and available beds
                const availableBeds = data.available_beds;
                const totalBeds = data.total_beds;
                const occupiedBeds = totalBeds - availableBeds;
                
                // Calculate percentages
                const availablePercentage = ((availableBeds / totalBeds) * 100).toFixed(2);
                const occupiedPercentage = ((occupiedBeds / totalBeds) * 100).toFixed(2);
                
                // Set available and occupied bed percentages
                document.getElementById('availableBeds').textContent = `${availablePercentage}%`;
                document.getElementById('occupiedBeds').textContent = `${occupiedPercentage}%`;
                
                // Set total students and staff
                document.getElementById('totalStudents').textContent = data.total_students;
                document.getElementById('totalStaff').textContent = data.total_staff;
    
                // Set up the chart
                const ctx = document.getElementById('roomChart').getContext('2d');
                const chart = new Chart(ctx, {
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
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
                                    }
                                }
                            }
                        }
                    }
                });
            });
        
    