# Mobile Testing - DateTimeChecker Flutter App

This directory contains mobile UI tests using **Maestro** for the DateTimeChecker Flutter mobile application.

## Prerequisites

### 1. Install Flutter
Follow the official Flutter installation guide: [https://docs.flutter.dev/get-started/install](https://docs.flutter.dev/get-started/install)

After installation, verify:
```bash
flutter --version
flutter doctor
```

### 2. Install Maestro
Follow the official Maestro installation guide: [https://maestro.mobile.dev/getting-started/installing-maestro](https://maestro.mobile.dev/getting-started/installing-maestro)

**On macOS/Linux:**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

**On Windows (WSL required):**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

After installation, verify:
```bash
maestro --version
```

### 3. Start the Spring Boot Backend
The mobile app connects to the backend API. Start it before running the app:
```bash
cd <project-root>
mvn spring-boot:run
```
The backend will start on `http://localhost:8081`.

## Running the Flutter App

```bash
cd <project-root>/flutter_app
flutter pub get
flutter run
```

> **Note for Android Emulator:** The app uses `http://10.0.2.2:8081` to connect to the host machine's localhost. If you are using an iOS Simulator or a physical device, update the `_baseUrl` constant in `flutter_app/lib/main.dart`.

## Running Mobile Tests

Make sure the Flutter app is running on an emulator/device, then:

```bash
# From the project root
maestro test tests/mobile/datetime-flow.yaml
```

Or using the npm script:
```bash
npm run test:mobile
```

## Test Coverage

The Maestro test flow (`datetime-flow.yaml`) covers:

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 1 | Valid date (25/5/2026) | Success message |
| 2 | Clear button | Inputs and message cleared |
| 3 | Invalid date (31/11/2026) | Error message |
| 4 | Leap year valid (29/2/2024) | Success message |
| 5 | Non-leap year (29/2/2025) | Error message |
| 6 | Invalid Day format ("abc") | Format error |
| 7 | Day out of range (32) | Range error |
| 8 | Month out of range (13) | Range error |
| 9 | Year out of range (999) | Range error |
| 10 | Exit confirmation dialog | Dialog appears, dismisses on "No" |
