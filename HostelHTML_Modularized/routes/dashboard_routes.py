from flask import Blueprint, jsonify, render_template
from extensions import mysql

dashboard_bp = Blueprint('dashboard_bp', __name__)

# Dashboard data endpoint
@dashboard_bp.route('/dashboard-info', methods=['GET'])
def get_dashboard_info():
    cur = mysql.connection.cursor()

    # Get total students count
    cur.execute("SELECT COUNT(*) FROM Hosteller")
    total_students = cur.fetchone()[0]

    # Get total staff count
    cur.execute("SELECT COUNT(*) FROM Staff")  # Assuming there's a Staff table
    total_staff = cur.fetchone()[0]

    # Get total room capacity and availability
    cur.execute("SELECT SUM(capacity), SUM(availability) FROM Room")
    total_capacity, available_capacity = cur.fetchone()

    # Calculate available and occupied beds
    available_beds = available_capacity
    occupied_beds = total_capacity - available_beds

    # Return the dashboard data
    return jsonify({
        'total_students': total_students,
        'total_staff': total_staff,
        'total_beds': total_capacity,
        'available_beds': available_beds
    })

@dashboard_bp.route('/dashboard')
def dsh():
    return render_template('dashboard.html')
