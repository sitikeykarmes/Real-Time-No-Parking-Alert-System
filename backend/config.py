import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///parking_violations.db'
    UPLOAD_FOLDER = 'static/uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    
    # AI Model Configuration
    AI_MODEL_PATH = os.environ.get('AI_MODEL_PATH') or 'models/parking_detection.pt'
    CONFIDENCE_THRESHOLD = float(os.environ.get('CONFIDENCE_THRESHOLD', 0.7))
    
    # Video Processing
    MAX_VIDEO_STREAMS = int(os.environ.get('MAX_VIDEO_STREAMS', 4))
    FRAME_RATE = int(os.environ.get('FRAME_RATE', 30))