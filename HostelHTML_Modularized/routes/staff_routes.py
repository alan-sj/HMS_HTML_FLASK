from flask import Blueprint, request, jsonify
from extensions import mysql

staff_bp = Blueprint('staff_bp', __name__)

@staff_bp.route('/staff', methods=['GET'])
def get_staff():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Staff")
    rows = cur.fetchall()
    cur.close()
    return jsonify([
        {
            'staff_id': row[0],
            'name': row[1],
            'role': row[2],
            'salary': str(row[3]),
            'date_of_joining': str(row[4]),
            'contact': row[5]
        } for row in rows
    ])

@staff_bp.route('/staff/<staff_id>', methods=['DELETE'])
def delete_staff(staff_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM Staff WHERE staff_id = %s", (staff_id,))
        mysql.connection.commit() 

        cur.close()
        return jsonify({'message': 'Staff deleted successfully!'}), 200
    except Exception as e:
        return jsonify({'message': f'Error deleting staff: {str(e)}'}), 500


@staff_bp.route('/staff', methods=['POST'])
def add_staff():
    try:
        data = request.get_json()

        staff_id = data.get('staff_id')
        name = data.get('name')
        role = data.get('role')
        salary = data.get('salary')
        date_of_joining = data.get('date_of_joining')
        contact = data.get('contact')

        cur = mysql.connection.cursor()
        # Check if staff ID already exists
        cur.execute("SELECT * FROM Staff WHERE staff_id = %s", (staff_id,))
        existing_staff = cur.fetchone()

        if existing_staff:
            return jsonify({'message': 'Staff ID already exists. Please use a unique Staff ID.'}), 409  

        # Insert new staff data
        cur.execute("""
            INSERT INTO Staff (staff_id, name, role, salary, date_of_joining, contact)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (staff_id, name, role, salary, date_of_joining, contact))

        mysql.connection.commit() 
        cur.close()

        return jsonify({'message': 'Staff added successfully!'}), 201  

    except Exception as e:
        return jsonify({'message': f'Error adding staff: {str(e)}'}), 500
