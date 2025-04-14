from flask import Blueprint, request, jsonify
from extensions import mysql

hosteller_bp = Blueprint('hosteller_bp', __name__)

@hosteller_bp.route('/hostellers', methods=['GET'])
def get_hostellers():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Hosteller")
    rows = cur.fetchall()
    cur.close()
    return jsonify([
        {
            'hosteller_id': row[0],
            'name': row[1],
            'room_no': row[2],
            'admission_no': row[3],
            'date_of_admission': str(row[4]),
            'contact': row[5]
        } for row in rows
    ])


@hosteller_bp.route('/hosteller', methods=['POST'])
def add_hosteller():
    data = request.json
    print(data)
    cur = mysql.connection.cursor()
    try:
        cur.execute("SELECT * FROM Hosteller where admission_no=%s",(data['admission_no'],))
        exist=cur.fetchone()
        if exist:
            return jsonify({'message':'Error:Hosteller exists with given ID'}),400
        
        cur.execute("""
            INSERT INTO Hosteller (name, room_no, admission_no, date_of_admission, contact) 
            VALUES (%s, %s, %s, %s, %s)
        """, (data['name'], data['room_no'], data['admission_no'], data['date_of_admission'], data['contact']))
        mysql.connection.commit()
        return jsonify({'message': 'Hosteller added successfully!'})
    except mysql.connection.Error as err:
        return jsonify({'message': f'Error: {str(err)}'}), 400
    finally:
        cur.close()


@hosteller_bp.route('/hosteller/<int:hosteller_id>', methods=['DELETE'])
def delete_hosteller(hosteller_id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM Hosteller WHERE hosteller_id = %s", (hosteller_id,))
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Hosteller deleted successfully!'})


