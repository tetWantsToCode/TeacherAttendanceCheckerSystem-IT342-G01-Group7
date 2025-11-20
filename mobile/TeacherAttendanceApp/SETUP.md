# Android Studio Setup Guide

## Quick Start

### 1. Open Project in Android Studio

```
File → Open → Select TeacherAttendanceApp folder
```

### 2. Gradle Sync

- Android Studio should automatically prompt to sync Gradle
- If not: `File → Sync Now`
- Wait for indexing to complete

### 3. Configure Backend URL (IMPORTANT)

Edit: `app/src/main/java/com/tacs/teacherattendance/util/ApiClient.kt`

```kotlin
private const val BASE_URL = "http://10.0.2.2:8080/"  // For emulator
// OR
private const val BASE_URL = "http://YOUR_IP:8080/"    // For physical device
```

### 4. Run the App

```
Run → Run 'app' (or Shift+F10)
```

Select target device (emulator or physical Android device)

## Virtual Device Setup (For Testing)

If you don't have a physical device:

### Create Android Virtual Device (AVD)

1. In Android Studio: `Tools → AVD Manager`
2. Click `Create Virtual Device`
3. Select device (e.g., Pixel 5)
4. Select API Level 30+ (Android 11+)
5. Finish setup
6. Start the emulator before running the app

## Testing the Login Screen

### Test Credentials

Use the following to test:

- **Email**: teacher@example.com
- **Password**: password123

(Register these first via the web app or create via backend database)

### Test Scenarios

1. **Valid Login**

   - Enter: teacher@example.com / password123
   - Expected: Success message, token stored

2. **Invalid Email**

   - Enter: notanemail
   - Expected: "Invalid email format" error

3. **Empty Fields**

   - Leave fields empty and tap Login
   - Expected: "Required" errors

4. **Invalid Credentials**
   - Enter: valid@email.com / wrongpassword
   - Expected: Error message from backend

## Key Files to Understand

| File                 | Purpose                  |
| -------------------- | ------------------------ |
| `LoginActivity.kt`   | UI entry point           |
| `LoginViewModel.kt`  | Business logic for login |
| `AuthRepository.kt`  | Data layer               |
| `AuthApiService.kt`  | API definitions          |
| `TokenManager.kt`    | Secure token storage     |
| `ApiClient.kt`       | Retrofit configuration   |
| `activity_login.xml` | Login UI layout          |

## Debugging Tips

### Check Network Calls

- Enable logging in `ApiClient.kt` (already enabled by default)
- View logs in Android Studio's Logcat:
  ```
  Window → Logcat
  ```
- Filter by package name: `com.tacs.teacherattendance`

### Common Issues

| Issue                  | Solution                                   |
| ---------------------- | ------------------------------------------ |
| Cannot find symbol     | Sync Gradle: `File → Sync Now`             |
| Connection refused     | Check backend is running on localhost:8080 |
| No internet permission | Already added in AndroidManifest.xml       |
| Token not saving       | Check device storage encryption is enabled |

## Build Variants

### Debug Build (Development)

```bash
./gradlew assembleDebug
```

- Debuggable
- No ProGuard obfuscation
- For testing

### Release Build (Production)

```bash
./gradlew assembleRelease
```

- Optimized
- Obfuscated with ProGuard
- Needs keystore signing

## Next: Preparing to Add More Screens

The current structure supports adding new screens. To add a new feature:

1. Create new Activity/Fragment in `ui/{feature_name}/`
2. Create ViewModel in same directory
3. Create Repository if needed (in `data/repository/`)
4. Add API endpoints to `AuthApiService.kt` if needed
5. Add layout XML in `res/layout/`
6. Add to AndroidManifest.xml
7. Use Navigation Component for routing (optional, can be added later)

## Support

For issues or questions, check:

- Main README.md in project root
- Backend logs: `backend/attendance-checker/`
- Android Studio official documentation
