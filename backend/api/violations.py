from flask import Blueprint, request, jsonify
from models.database import get_db
from models.violation import Violation

violations_bp = Blueprint('violations', __name__)

@violations_bp.route('/', methods=['GET'])
def get_violations():
    db = next(get_db())
    violations = db.query(Violation).all()
    return jsonify([violation.to_dict() for violation in violations])

@violations_bp.route('/<int:violation_id>', methods=['PUT'])
def acknowledge_violation(violation_id):
    db = next(get_db())
    violation = db.query(Violation).filter(Violation.id == violation_id).first()
    
    if not violation:
        return jsonify({'error': 'Violation not found'}), 404
    
    from datetime import datetime
    violation.acknowledged_at = datetime.utcnow()
    violation.status = 'acknowledged'
    
    db.commit()
    return jsonify(violation.to_dict())