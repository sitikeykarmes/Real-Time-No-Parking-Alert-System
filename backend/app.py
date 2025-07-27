from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from models.database import init_db
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize database
init_db()

# Import API routes
from api.locations import locations_bp
from api.violations import violations_bp

app.register_blueprint(locations_bp, url_prefix='/api/locations')
app.register_blueprint(violations_bp, url_prefix='/api/violations')

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Parking Violation API is running'})

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('connected', {'message': 'Connected to server'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
