from flask import Blueprint, request, jsonify
from extensions import mysql
from datetime import datetime

attendance_bp = Blueprint('attendance_bp', __name__)

# Fetch attendance for a selected month (default: current month)
@attendance_bp.route('/attendance-info/json', methods=['GET'])
def get_attendance():
    # Extract month and year from request args, or default to current month/year
    selected_month = request.args.get('month')
    
    if selected_month:
        try:
            year, month = map(int, selected_month.split('-'))
        except ValueError:
            return jsonify({"error": "Invalid month format. Use YYYY-MM"}), 400
    else:
        now = datetime.now()
        month, year = now.month, now.year

    cur = mysql.connection.cursor()
    query = """
        SELECT h.admission_no, h.name, IFNULL(a.days_present, 0) AS days_present
        FROM hosteller h
        LEFT JOIN attendance a ON h.admission_no = a.admission_no 
            AND a.month = %s AND a.year = %s
    """
    cur.execute(query, (month, year))
    data = cur.fetchall()
    cur.close()
    
    return jsonify([
        {'admission_no': row[0], 'name': row[1], 'days_present': row[2]} for row in data
    ])

# Mark attendance (increase days_present count) for selected month
@attendance_bp.route('/attendance/update', methods=['POST'])
def update_attendance():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No students selected!'}), 400

    selected_month = data[0].get('month')  # All records will have the same month
    try:
        year, month = map(int, selected_month.split('-'))
    except ValueError:
        return jsonify({"error": "Invalid month format. Use YYYY-MM"}), 400

    cur = mysql.connection.cursor()
    for record in data:
        admission_no = record['admission_no']
        cur.execute("""
            INSERT INTO attendance (admission_no, month, year, days_present)
            VALUES (%s, %s, %s, 1)
            ON DUPLICATE KEY UPDATE days_present = days_present + 1
        """, (admission_no, month, year))

    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Attendance updated successfully!'})
