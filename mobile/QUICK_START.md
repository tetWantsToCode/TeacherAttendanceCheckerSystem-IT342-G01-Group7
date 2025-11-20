# Quick Reference Guide - Android Login Setup

## 📋 Checklist Before Running

- [ ] Android Studio installed (latest version)
- [ ] Android SDK 26+ installed
- [ ] Backend running on http://localhost:8080
- [ ] Test credentials created in backend database

## 🔌 Backend Setup Required

Before testing the app, ensure your Spring Boot backend is running:

```bash
cd backend/attendance-checker
./mvnw spring-boot:run
```

Backend should be accessible at: http://localhost:8080

### Test Credentials

Add these to your database:

- Email: `teacher@example.com`
- Password: `password123`

(Or use your own credentials registered through the web app)

## 📱 Opening the Project

```
1. Open Android Studio
2. File → Open
3. Navigate to: TeacherAttendanceApp
4. Click Open
5. Wait for Gradle sync (auto-triggered)
```

## ⚙️ Configuration

### CRITICAL: Set Backend URL

**File**: `app/src/main/java/com/tacs/teacherattendance/util/ApiClient.kt`

**Line**: `private const val BASE_URL = "http://10.0.2.2:8080/"`

- **For Android Emulator**: Keep as `http://10.0.2.2:8080/`
- **For Physical Device**: Change to `http://YOUR_COMPUTER_IP:8080/`
  - Example: `http://192.168.1.100:8080/`
  - Find your IP: Run `ipconfig` in command prompt

## ▶️ Running the App

### Option 1: Android Emulator

```
1. Tools → AVD Manager
2. Create or start existing emulator
3. Run → Run 'app'
4. Select emulator device
5. Click OK
```

### Option 2: Physical Device

```
1. Enable USB Debugging on your phone
   Settings → Developer Options → USB Debugging
2. Connect phone via USB
3. Run → Run 'app'
4. Select physical device
5. Click OK
```

## 🧪 Testing the Login

### Valid Credentials Test

```
Email: teacher@example.com
Password: password123

Expected: Success message + Navigate to dashboard
```

### Invalid Email Test

```
Email: notanemail
Password: anything

Expected: "Invalid email format" error message
```

### Empty Fields Test

```
Leave fields empty
Click Login

Expected: "Email is required", "Password is required" errors
```

### Wrong Credentials Test

```
Email: teacher@example.com
Password: wrongpassword

Expected: Error from backend (401 Unauthorized)
```

## 🐛 Troubleshooting

| Problem                    | Solution                                               |
| -------------------------- | ------------------------------------------------------ |
| "Cannot connect to server" | Check ApiClient.kt BASE_URL, ensure backend is running |
| "Build failed"             | Run `File → Sync Now`, check Java/Gradle version       |
| "Emulator slow"            | Use Android Studio's Emulator, not older versions      |
| "Token not saving"         | Check device encryption is enabled in settings         |
| "App crashes on login"     | Check Logcat tab for detailed error messages           |

## 📊 Debugging

### View Network Logs

```
Window → Logcat
Filter: com.tacs.teacherattendance
Look for: OkHttp and Retrofit logs
```

### View JSON Responses

```
Open Logcat
Search for: "okhttp.logging"
See full request/response bodies
```

## 📁 Important Files

| File                 | Purpose        | Edit For               |
| -------------------- | -------------- | ---------------------- |
| `ApiClient.kt`       | Backend URL    | Server address changes |
| `LoginActivity.kt`   | Login screen   | UI changes             |
| `LoginViewModel.kt`  | Business logic | Validation rules       |
| `activity_login.xml` | Layout         | Design changes         |
| `colors.xml`         | App colors     | Theme customization    |

## 🔑 Key Code Locations

### Login flow happens in:

1. **UI Input** → `LoginActivity.kt` line ~50
2. **Validation** → `LoginViewModel.kt` line ~35-55
3. **API Call** → `AuthRepository.kt` line ~15-20
4. **Token Save** → `TokenManager.kt` line ~14-16

### Token Auto-Login:

- File: `LoginActivity.kt` line ~36-40
- Checks for existing token on app start
- Skips login if token valid

## 📦 Building APK

### Debug APK (For Testing)

```bash
./gradlew assembleDebug
Location: app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (For Distribution)

```bash
./gradlew assembleRelease
Location: app/build/outputs/apk/release/app-release.apk
(Requires keystore signing)
```

## 📚 Documentation Files

- **README.md** - Full project documentation
- **SETUP.md** - Detailed setup guide
- **PROJECT_STRUCTURE.md** - Architecture explanation
- **COMPLETION_REPORT.md** - What was built
- **FILE_MANIFEST.md** - All created files list

## 🎯 Next Development Steps

After login works, add:

1. Dashboard screen
2. Course list
3. Attendance marking
4. Student list
5. User profile
6. Logout feature

Each feature follows same pattern:

- Create Activity/Fragment in `ui/`
- Create ViewModel in same directory
- Create Repository if needed in `data/`
- Add API endpoints if needed in `AuthApiService.kt`

## ✅ Success Criteria

Login page is working when:

- ✅ App launches to login screen
- ✅ Valid credentials log in successfully
- ✅ Invalid credentials show error
- ✅ Empty fields show validation errors
- ✅ Token persists on app restart
- ✅ Network logs show POST to /api/auth/login
- ✅ Backend logs show login attempt

---

**Still Need Help?**

1. Check detailed SETUP.md file
2. Review Android Studio documentation
3. Check backend server logs for API errors
4. View Logcat for Android app errors
5. Verify network connectivity

**Ready to Run!** 🚀
