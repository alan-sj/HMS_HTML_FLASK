from flask import Blueprint, jsonify
from extensions import mysql

dashboard_bp = Blueprint('dashboard_bp', __name__)

@dashboard_bp.route('/dashboard-info', methods=['GET'])
def get_dashboard_info():
    cur = mysql.connection.cursor()

    cur.execute("SELECT COUNT(*) FROM Hosteller")
    total_students = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM Staff")  
    total_staff = cur.fetchone()[0]

    cur.execute("SELECT SUM(capacity), SUM(availability) FROM Room")
    total_capacity, available_capacity = cur.fetchone()

    available_beds = available_capacity
    occupied_beds = total_capacity - available_beds

    return jsonify({
        'total_students': total_students,
        'total_staff': total_staff,
        'total_beds': total_capacity,
        'available_beds': available_beds
    })

