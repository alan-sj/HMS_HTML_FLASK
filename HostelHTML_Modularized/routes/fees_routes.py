from decimal import Decimal
from flask import Blueprint, render_template, request, jsonify
from extensions import mysql
from datetime import datetime

fees_bp = Blueprint('fees_bp', __name__)

# Fetch Fees Data for Selected Month
@fees_bp.route('/fees-info/json', methods=['GET'])
def fetch_fees_data():
    month = request.args.get('month')
    year = request.args.get('year')

    if not month or not year:
        return jsonify({"error": "Month and year are required"}), 400

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT h.admission_no, h.name, h.room_no, 
               IFNULL(a.days_present, 0) AS days_present, 
               IFNULL(f.total_fee, 0) AS total_fee, 
               IFNULL(f.paid_amount, 0) AS paid_amount, 
               IFNULL(f.total_fee - f.paid_amount, 0) AS pending_amount,
               CASE WHEN IFNULL(f.total_fee - f.paid_amount, 0) = 0 THEN 'Paid' ELSE 'Pending' END AS fee_status
        FROM hosteller h
        LEFT JOIN attendance a 
            ON h.admission_no = a.admission_no AND a.month = %s AND a.year = %s
        LEFT JOIN fee f 
            ON h.admission_no = f.admission_no AND f.month = %s AND f.year = %s
    """, (month, year, month, year))

    fees_data = [
        {
            "admission_no": row[0],
            "name": row[1],
            "room_no": row[2],
            "days_present": row[3],
            "total_fee": row[4],
            "paid_amount": row[5],
            "pending_amount": row[6],
            "fee_status": row[7]
        }
        for row in cur.fetchall()
    ]

    cur.close()
    return jsonify(fees_data)

# Set Fees for a Month
@fees_bp.route('/calculate_fees', methods=['POST'])
def calculate_fees():
    data = request.get_json()
    month, year, per_day_fee = data.get('month'), data.get('year'), data.get('per_day_fee')

    if not month or not year or not per_day_fee:
        return jsonify({"error": "Month, year, and per_day_fee are required"}), 400

    cur = mysql.connection.cursor()

    # Fetch attendance records
    cur.execute("""
        SELECT admission_no, SUM(days_present) 
        FROM attendance 
        WHERE month = %s AND year = %s
        GROUP BY admission_no
    """, (month, year))

    attendance_data = cur.fetchall()

    print("Attendance Data:", attendance_data)  # Debugging print

    # Insert or update fee records
    for record in attendance_data:
        admission_no, days_present = record[0], record[1]
        total_fee = days_present * int(per_day_fee)

        print(f"Inserting: {admission_no}, Month: {month}, Year: {year}, Fee: {total_fee}")  # Debug

        cur.execute("""
            INSERT INTO fee (admission_no, month, year, total_fee, paid_amount, pending_amount) 
            VALUES (%s, %s, %s, %s, 0, %s) 
            ON DUPLICATE KEY UPDATE total_fee = VALUES(total_fee), pending_amount = VALUES(pending_amount)
        """, (admission_no, month, year, total_fee, total_fee))

    mysql.connection.commit()
    cur.close()
    
    return jsonify({"message": f"Fees updated successfully for {month}/{year}"}), 200

# Mark Fees as Paid
@fees_bp.route('/mark_paid', methods=['POST'])
def mark_paid():
    data = request.get_json()
    admission_no, month, year = data.get('admission_no'), data.get('month'), data.get('year')

    if not admission_no or not month or not year:
        return jsonify({"error": "Admission number, month, and year are required"}), 400

    cur = mysql.connection.cursor()

    cur.execute("""
        UPDATE fee 
        SET paid_amount = total_fee, pending_amount = 0 
        WHERE admission_no = %s AND month = %s AND year = %s
    """, (admission_no, month, year))

    mysql.connection.commit()
    cur.close()
    return jsonify({"message": f"Fees marked as paid for {admission_no}"}), 200

# Render Fees Management Page
@fees_bp.route('/fees')
def fees_management():
    return render_template('fees.html')
