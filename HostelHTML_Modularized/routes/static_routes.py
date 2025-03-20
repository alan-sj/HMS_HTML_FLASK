from flask import Blueprint, render_template, request, jsonify
from extensions import mysql

static_bp = Blueprint('static_bp', __name__)

# ---------------- Static Routes ----------------
@static_bp.route('/')
def home():
    return "Backend running..."

@static_bp.route('/fees-info')
def fees_info():
    return render_template('fees.html')


@static_bp.route('/hosteller-info')
def hosteller_info():
    return render_template('hostellerInfo.html')


@static_bp.route('/staff-info')
def staff_info():
    return render_template('staffInfo.html')

@static_bp.route('/room')
def room():
    return render_template('room.html')

@static_bp.route('/attendance-info')
def attendance():
    return render_template('attendance.html')

@static_bp.route('/login')
def login():
    return render_template('login.html')

@static_bp.route('/dashboard')
def dsh():
    return render_template('dashboard.html')



