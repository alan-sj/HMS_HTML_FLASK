from flask import Blueprint, render_template, request, jsonify
from extensions import mysql

room_bp = Blueprint('room_bp', __name__)

# ---------------- Room APIs ----------------
@room_bp.route('/get-room-details', methods=['GET'])
def get_room_details():
    try:
        cur = mysql.connection.cursor()

        # SQL query to fetch room and hosteller details
        cur.execute("""
            SELECT room.room_no, room.capacity, room.availability, 
                   hosteller.name AS hosteller_name, hosteller.admission_no
            FROM room
            LEFT JOIN hosteller ON room.room_no = hosteller.room_no
        """)

        rows = cur.fetchall()
        cur.close()

        return jsonify([
            {
                'room_no': row[0],
                'capacity': row[1],
                'availability': row[2],
                'hosteller_name': row[3] if row[3] else 'No Occupant',
                'admission_no': row[4] if row[4] else 'N/A'
            } for row in rows
        ])
    except Exception as e:
        return jsonify({'message': f'Error fetching room details: {str(e)}'}), 500

@room_bp.route('/add-room', methods=['POST'])
def add_room():
    try:
        data = request.get_json()
        room_no = data['room_no']
        capacity = data['capacity']
        availability = data['availability']

        cur = mysql.connection.cursor()

        # SQL query to insert a new room
        cur.execute("""
            INSERT INTO room (room_no, capacity, availability)
            VALUES (%s, %s, %s)
        """, (room_no, capacity, capacity))

        mysql.connection.commit()
        cur.close()

        return jsonify({'success': True, 'message': 'Room added successfully'})

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error adding room: {str(e)}'}), 500

@room_bp.route('/room')
def room():
    return render_template('room.html')

# ---------------- Run Server ----------------
if __name__ == '__main__':
    room_bp.run(debug=True)
