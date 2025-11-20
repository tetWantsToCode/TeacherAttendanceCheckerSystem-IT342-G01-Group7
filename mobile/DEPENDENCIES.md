# Dependencies Reference

## All Project Dependencies (Gradle)

### Root Level (build.gradle)

```gradle
plugins {
    id 'com.android.application' version '8.1.0'
    id 'com.android.library' version '8.1.0'
    id 'org.jetbrains.kotlin.android' version '1.9.10'
}
```

### App Module (app/build.gradle)

#### AndroidX & Core Libraries

```gradle
implementation 'androidx.core:core-ktx:1.12.0'
implementation 'androidx.appcompat:appcompat:1.6.1'
implementation 'com.google.android.material:material:1.10.0'
implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
```

#### Lifecycle & ViewModel

```gradle
implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.6.2'
implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2'
implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.6.2'
```

#### Kotlin Coroutines

```gradle
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3'
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
```

#### Retrofit & Networking

```gradle
implementation 'com.squareup.retrofit2:retrofit:2.9.0'
implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
implementation 'com.squareup.okhttp3:okhttp:4.11.0'
implementation 'com.squareup.okhttp3:logging-interceptor:4.11.0'
```

#### JSON Serialization

```gradle
implementation 'com.google.code.gson:gson:2.10.1'
```

#### Security & Encryption

```gradle
implementation 'androidx.security:security-crypto:1.1.0-alpha06'
```

#### Testing

```gradle
testImplementation 'junit:junit:4.13.2'
androidTestImplementation 'androidx.test.ext:junit:1.1.5'
androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
```

---

## Build Configuration

### Android SDK

- **compileSdk**: 34
- **minSdk**: 26
- **targetSdk**: 34

### Java & Kotlin

- **Java Version**: 17
- **Kotlin Version**: 1.9.10
- **Gradle**: 8.4

---

## Library Purposes

| Library                    | Version       | Purpose                     |
| -------------------------- | ------------- | --------------------------- |
| kotlin-stdlib              | 1.9.10        | Kotlin standard library     |
| androidx-core-ktx          | 1.12.0        | Android core extensions     |
| appcompat                  | 1.6.1         | Backwards compatibility     |
| material                   | 1.10.0        | Material Design components  |
| constraintlayout           | 2.1.4         | UI layout system            |
| lifecycle-runtime-ktx      | 2.6.2         | Lifecycle-aware components  |
| lifecycle-viewmodel-ktx    | 2.6.2         | ViewModel support           |
| lifecycle-livedata-ktx     | 2.6.2         | LiveData observables        |
| kotlinx-coroutines-core    | 1.7.3         | Async operations            |
| kotlinx-coroutines-android | 1.7.3         | Android-specific coroutines |
| retrofit                   | 2.9.0         | HTTP client framework       |
| converter-gson             | 2.9.0         | Retrofit Gson converter     |
| okhttp                     | 4.11.0        | HTTP client library         |
| logging-interceptor        | 4.11.0        | OkHttp logging              |
| gson                       | 2.10.1        | JSON serialization          |
| security-crypto            | 1.1.0-alpha06 | Encrypted preferences       |
| junit                      | 4.13.2        | Unit testing                |
| androidx-test-ext-junit    | 1.1.5         | Android test framework      |
| espresso-core              | 3.5.1         | UI testing                  |

---

## Installation & Build

### Prerequisites

```
- Android Studio 2023.1.1 or later
- Android SDK 26+ installed
- Java 17 JDK
- Gradle 8.4 (automatic with Android Studio)
```

### Building

```bash
# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Clean and rebuild
./gradlew clean assembleDebug

# Install debug APK to device/emulator
./gradlew installDebug
```

---

## Dependency Resolution

All dependencies are resolved from:

- **Google Maven Repository** (for AndroidX, Google libraries)
- **Maven Central** (for open-source libraries)
- **Gradle Plugin Portal** (for build plugins)

---

## Security Considerations

### Encryption

- EncryptedSharedPreferences uses AES-256-GCM
- Requires device encryption support
- Automatic key generation and rotation

### SSL/TLS

- Configure in network_security_config.xml (when needed)
- Certificate pinning ready for implementation

### Obfuscation

- ProGuard rules configured in proguard-rules.pro
- Enables code obfuscation for release builds

---

## Testing Dependencies

### Current Test Setup

```gradle
testImplementation 'junit:junit:4.13.2'
androidTestImplementation 'androidx.test.ext:junit:1.1.5'
androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
```

### Optional Testing Libraries (Can Add Later)

```gradle
// For mocking
testImplementation 'io.mockk:mockk:1.13.5'

// For coroutine testing
testImplementation 'org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3'

// For room database testing
androidTestImplementation 'androidx.room:room-testing:2.6.0'

// For UI testing
androidTestImplementation 'androidx.test.uiautomator:uiautomator:2.3.0'
```

---

## Version Management

### How to Update Dependencies

1. **Check for updates**

   ```bash
   ./gradlew dependencyUpdates
   ```

2. **Update specific library**

   - Edit app/build.gradle
   - Change version number
   - Run `File → Sync Now` in Android Studio

3. **Update all tools**
   - In Android Studio: Tools → SDK Manager
   - Update Android SDK, Build Tools, etc.

---

## Common Issues & Solutions

| Issue                         | Cause                    | Solution                         |
| ----------------------------- | ------------------------ | -------------------------------- |
| Gradle sync fails             | Version mismatch         | Update gradle-wrapper.properties |
| Retrofit not working          | Wrong URL                | Check ApiClient.kt BASE_URL      |
| Token not encrypting          | Encryption not available | Check device encryption settings |
| Coroutines error              | Missing import           | Import kotlinx.coroutines        |
| Material components not found | Wrong dependency         | Use 'material' not 'materialize' |

---

## Performance Optimization

### Already Implemented

- Coroutines for non-blocking operations
- Lifecycle-aware components
- Lazy initialization where possible
- ProGuard for method reduction in release builds

### Can Be Added Later

- Dagger/Hilt for dependency injection
- Data binding for view updates
- Room database for caching
- Paging library for large lists

---

## Backward Compatibility

- **Min API Level**: 26 (Android 8.0)
- **Target API Level**: 34 (Android 14)
- **Compile API Level**: 34 (Android 14)

All dependencies support API 26+.

---

## Firebase Integration (Optional)

If you need Firebase later, add:

```gradle
implementation platform('com.google.firebase:firebase-bom:32.4.0')
implementation 'com.google.firebase:firebase-analytics-ktx'
implementation 'com.google.firebase:firebase-messaging-ktx'
```

---

## Notes for Team

- All dependencies are from official sources (Google, Maven Central)
- No deprecated libraries used
- Target API 34 (Android 14) for Play Store compliance
- Min SDK 26 chosen for broad device support
- Kotlin 1.9.10 is stable and widely used
- Retrofit chosen over other HTTP clients for simplicity

---

**Last Updated**: November 19, 2025
**Gradle Version**: 8.4
**Kotlin Version**: 1.9.10
