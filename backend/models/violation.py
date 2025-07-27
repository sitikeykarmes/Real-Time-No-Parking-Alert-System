from sqlalchemy import Column, String, Integer, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from models.database import Base
from datetime import datetime

class Violation(Base):
    __tablename__ = 'violations'
    
    id = Column(Integer, primary_key=True)
    location_id = Column(String, ForeignKey('locations.id'))
    vehicle_id = Column(Integer)
    detected_at = Column(DateTime, default=datetime.utcnow)
    duration_seconds = Column(Float)
    confidence_score = Column(Float)
    image_path = Column(String(255))
    video_path = Column(String(255))
    status = Column(String(20), default='active')
    acknowledged_at = Column(DateTime)
    
    location = relationship("Location")
    
    def to_dict(self):
        return {
            'id': self.id,
            'location_id': self.location_id,
            'vehicle_id': self.vehicle_id,
            'detected_at': self.detected_at.isoformat() if self.detected_at else None,
            'duration_seconds': self.duration_seconds,
            'confidence_score': self.confidence_score,
            'image_path': self.image_path,
            'video_path': self.video_path,
            'status': self.status,
            'acknowledged_at': self.acknowledged_at.isoformat() if self.acknowledged_at else None
        }