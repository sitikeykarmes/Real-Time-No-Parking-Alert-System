from flask import Blueprint, request, jsonify
from models.database import get_db
from models.location import Location

locations_bp = Blueprint('locations', __name__)

@locations_bp.route('/', methods=['GET'])
def get_locations():
    db = next(get_db())
    locations = db.query(Location).all()
    return jsonify([location.to_dict() for location in locations])

@locations_bp.route('/', methods=['POST'])
def create_location():
    data = request.get_json()
    db = next(get_db())
    
    location = Location(
        name=data.get('name'),
        description=data.get('description'),
        video_source=data.get('video_source'),
        status='inactive'
    )
    
    db.add(location)
    db.commit()
    db.refresh(location)
    
    return jsonify(location.to_dict()), 201

@locations_bp.route('/<location_id>', methods=['PUT'])
def update_location(location_id):
    data = request.get_json()
    db = next(get_db())
    
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        return jsonify({'error': 'Location not found'}), 404
    
    location.name = data.get('name', location.name)
    location.description = data.get('description', location.description)
    location.video_source = data.get('video_source', location.video_source)
    location.status = data.get('status', location.status)
    
    db.commit()
    return jsonify(location.to_dict())

@locations_bp.route('/<location_id>', methods=['DELETE'])
def delete_location(location_id):
    db = next(get_db())
    location = db.query(Location).filter(Location.id == location_id).first()
    
    if not location:
        return jsonify({'error': 'Location not found'}), 404
    
    db.delete(location)
    db.commit()
    return jsonify({'message': 'Location deleted successfully'})