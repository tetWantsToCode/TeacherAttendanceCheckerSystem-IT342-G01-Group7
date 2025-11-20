# Teacher Attendance Checker - Mobile App (Android/Kotlin)

## Overview

This is the Android mobile version of the Teacher Attendance Checker System, built using Kotlin with modern Android architecture patterns.

## Architecture

- **MVVM Pattern**: Model-View-ViewModel for clear separation of concerns
- **Repository Pattern**: Data layer abstraction
- **Retrofit**: HTTP client for API communication
- **Coroutines**: Asynchronous operations
- **ViewModel & LiveData**: State management

## Project Structure

```
app/
├── src/
│   ├── main/
│   │   ├── java/com/tacs/teacherattendance/
│   │   │   ├── data/
│   │   │   │   ├── api/          # Retrofit API interfaces
│   │   │   │   ├── models/       # Data classes (DTOs)
│   │   │   │   └── repository/   # Repository pattern implementation
│   │   │   ├── ui/
│   │   │   │   └── login/        # Login screen (Activity, ViewModel)
│   │   │   ├── util/             # Utilities (TokenManager, ApiClient)
│   │   │   └── TeacherAttendanceApp.kt
│   │   ├── res/
│   │   │   ├── layout/           # XML layouts
│   │   │   ├── values/           # Colors, strings, themes
│   │   │   └── xml/              # Backup and extraction rules
│   │   └── AndroidManifest.xml
│   └── test/
├── build.gradle
└── proguard-rules.pro
```

## Features Implemented

### Login Screen

- Email and password input fields with validation
- Real-time error messages
- JWT token-based authentication
- Secure token storage using EncryptedSharedPreferences
- Loading state management
- Auto-login if token exists

### Backend Integration

- API endpoints connected to Spring Boot backend
- Authentication flow: Login → Receive JWT → Store Securely
- HTTP interceptors for automatic token injection
- Error handling and logging

## Setup Instructions

### Prerequisites

- Android Studio (latest version)
- Android SDK 26+ (API level 26+)
- Kotlin 1.9+
- Java 17+

### Configuration

1. **Base URL Configuration**

   - Located in: `app/src/main/java/com/tacs/teacherattendance/util/ApiClient.kt`
   - Change `BASE_URL = "http://10.0.2.2:8080/"` to your backend server URL
   - For physical devices: Use your actual server IP address
   - For emulator: Use `10.0.2.2` to access localhost

2. **Backend Requirements**
   - Backend must be running on `http://localhost:8080`
   - Ensure `/api/auth/login` endpoint is available
   - JWT token should be returned in `AuthResponse.token`

### Building the Project

```bash
# Clone the repository
cd mobile/TeacherAttendanceApp

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Run on emulator/device
./gradlew installDebug
```

## Dependencies

- **AndroidX**: Core, AppCompat, ConstraintLayout, Lifecycle
- **Kotlin Coroutines**: 1.7.3
- **Retrofit**: 2.9.0 (HTTP Client)
- **OkHttp**: 4.11.0 (HTTP interceptors)
- **Material Components**: 1.10.0
- **Gson**: 2.10.1 (JSON serialization)
- **Android Security**: Crypto for encrypted preferences

## API Endpoints Used

### Authentication

- **Login**: `POST /api/auth/login`

  - Request: `LoginRequest { email, password }`
  - Response: `AuthResponse { token }`

- **Register**: `POST /api/auth/register` (prepared for future)
  - Request: `RegisterRequest { email, password, fullName }`
  - Response: Success message

## Token Management

Tokens are securely stored using Android's `EncryptedSharedPreferences`:

- Automatic encryption with AES-256-GCM
- Tokens included in all API requests via Authorization header
- Format: `Authorization: Bearer {token}`

## Security Considerations

1. ✅ HTTPS ready (configure in ApiClient)
2. ✅ Encrypted token storage
3. ✅ Input validation on client side
4. ✅ Proguard rules for code obfuscation
5. ⚠️ Network security config (can be enhanced)

## Next Steps

1. **Dashboard/Home Screen**: List teacher's courses and attendance
2. **Attendance Marking**: Mark attendance for students
3. **Student List**: View enrolled students per course
4. **Settings**: User profile, logout, preferences
5. **Offline Mode**: Local caching for offline functionality
6. **Push Notifications**: For attendance alerts
7. **Unit Tests**: Add test cases for ViewModels and Repository

## Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Email validation (empty, invalid format)
- [ ] Password validation (empty, too short)
- [ ] Token persistence (app restart)
- [ ] Auto-login on valid token
- [ ] Logout functionality (when implemented)

### To Test on Emulator

1. Start the backend server on localhost:8080
2. Run the Android emulator
3. Install the app: `./gradlew installDebug`
4. Use test credentials from your backend setup

## Troubleshooting

**Problem**: Cannot connect to backend

- **Solution**: Check BASE_URL in ApiClient.kt, ensure backend is running

**Problem**: Login fails with "Unknown error"

- **Solution**: Check network connectivity, verify API endpoint, check backend logs

**Problem**: Token not persisting

- **Solution**: Verify EncryptedSharedPreferences setup, check device encryption settings

## Contributing

When adding new features:

1. Follow MVVM pattern
2. Create separate packages for each feature
3. Use LiveData for state management
4. Add proper error handling
5. Update documentation

## License

Team Project - IT342-G01-Group7
