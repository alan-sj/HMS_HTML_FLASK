import webbrowser
from flask import Flask
from extensions import mysql  # ✅ Import mysql from extensions

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'html'

mysql.init_app(app)

# -------- Register Blueprints --------
from routes.static_routes import static_bp
from routes.hosteller_routes import hosteller_bp
from routes.staff_routes import staff_bp
from routes.fees_routes import fees_bp
from routes.attendance_routes import attendance_bp
from routes.dashboard_routes import dashboard_bp
from routes.room_routes import room_bp
from routes.login import login_bp 

app.register_blueprint(static_bp)
app.register_blueprint(hosteller_bp)
app.register_blueprint(staff_bp)
app.register_blueprint(fees_bp)
app.register_blueprint(attendance_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(room_bp)  
app.register_blueprint(login_bp)


# -------- Run Server --------
if __name__ == '__main__':
    webbrowser.open('http://127.0.0.1:5000/login')
    app.run(debug=True)
    
