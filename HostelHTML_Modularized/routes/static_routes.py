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


