from flask import Blueprint,request,jsonify
from extensions import mysql

login_bp=Blueprint('login_bp',__name__)

@login_bp.route('/login',methods=['POST'])
def authenticarion():
    data=request.get_json()
    username=data.get('username')
    pwd=data.get('password')
    cur=mysql.connection.cursor()
    cur.execute("Select * from login where username=%s and pwd=%s",(username,pwd))
    valid=cur.fetchone()
    print("Query Result:", valid)
    cur.close()
    if not valid:
        return jsonify({'error':'Invalid credentials'}),400
    return jsonify(valid)
