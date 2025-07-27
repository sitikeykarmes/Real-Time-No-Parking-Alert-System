from sqlalchemy import Column, String, DateTime, Text, Boolean
from models.database import Base
from datetime import datetime
import uuid

class Location(Base):
    __tablename__ = 'locations'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    description = Column(Text)
    video_source = Column(String(255))
    status = Column(String(20), default='inactive')
    is_monitoring = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'video_source': self.video_source,
            'status': self.status,
            'is_monitoring': self.is_monitoring,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }