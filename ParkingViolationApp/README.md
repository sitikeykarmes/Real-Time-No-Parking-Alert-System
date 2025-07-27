# Parking Violation Mobile App (Expo)

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your phone (for testing)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend will run on http://localhost:5000

### Mobile App Setup (Expo)

```bash
cd ParkingViolationApp
npm install
expo start
```

Scan the QR code with Expo Go app or run on simulator.

## Expo Advantages

✅ **Faster Development**: No need for Android Studio/Xcode setup
✅ **Live Reload**: Instant updates on device
✅ **Easy Testing**: Test on real device with Expo Go
✅ **Cross Platform**: One codebase for iOS and Android
✅ **Built-in Features**: Camera, notifications, etc.
✅ **Easy Deployment**: Simple build and publish process

## Project Structure

```
parking-violation-system/
├── backend/                 # Flask API server
│   ├── models/             # Database models
│   ├── api/                # API endpoints
│   ├── services/           # Business logic (AI integration here)
│   └── static/             # File storage
└── ParkingViolationApp/    # Expo React Native app
    ├── app.json            # Expo configuration
    └── src/
        ├── screens/        # App screens
        ├── services/       # API and WebSocket
        ├── navigation/     # App navigation
        └── types/          # TypeScript types
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Create new location
- `PUT /api/locations/{id}` - Update location
- `DELETE /api/locations/{id}` - Delete location
- `GET /api/violations` - Get all violations
- `PUT /api/violations/{id}` - Acknowledge violation

## Development Workflow

1. **Start Backend**: `cd backend && python app.py`
2. **Start Expo**: `cd ParkingViolationApp && expo start`
3. **Open Expo Go** on your phone and scan QR code
4. **Develop**: Make changes and see them instantly on device

## Testing the App

1. **Test API Connection**: Use "Test Connection" button on dashboard
2. **Add Locations**: Add test parking locations
3. **View Locations**: Check location list and status toggles
4. **WebSocket**: Check connection status indicator

## Next Integration Steps

### 1. AI Model Integration

Update `backend/services/ai_processor.py` with your existing model:

```python
class ParkingViolationProcessor:
    def __init__(self, model_path='your_model.pt'):
        # Load your existing YOLO + CNN model
        self.model = YourModel(model_path)

    def process_frame(self, frame):
        # Your existing detection logic
        violations = self.model.detect_violations(frame)
        return violations
```

### 2. Video Streaming

Add video streaming endpoints in backend and camera components in Expo app.

### 3. Real-time Notifications

Configure Expo push notifications for violation alerts.

### 4. Advanced Features

- Live camera feed
- Video recording
- Export reports
- Multi-location monitoring

## Deployment

### Development

- Backend: Run locally with `python app.py`
- Mobile: Test with Expo Go app

### Production

- Backend: Deploy to Heroku, AWS, or similar
- Mobile: Build with `expo build` and publish to app stores

## Troubleshooting

### Common Issues

1. **API Connection Errors**

   - Check backend is running on correct port
   - Update IP address in `src/services/api.ts` for physical device testing

2. **Expo Start Issues**

   - Clear cache: `expo start -c`
   - Check Node.js version: `node --version`

3. **Device Connection**
   - Ensure phone and computer are on same network
   - Check firewall settings

### Network Configuration

For testing on physical device, update the IP address in `src/services/api.ts`:

```typescript
// Replace with your computer's IP address
const API_BASE_URL = "http://192.168.1.100:5000/api";
```

## Benefits of Expo vs Bare React Native

| Feature         | Expo            | Bare RN            |
| --------------- | --------------- | ------------------ |
| Setup Time      | 5 minutes       | 1-2 hours          |
| Device Testing  | QR code scan    | Build required     |
| Updates         | Over-the-air    | App store only     |
| Native Features | Pre-built       | Manual setup       |
| Build Process   | Cloud builds    | Local setup needed |
| Debugging       | Excellent tools | More complex       |

Perfect for rapid prototyping and getting your parking violation app running quickly!
