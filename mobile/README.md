# Mobile App - My Health Chain

## Quick Start

```powershell
npm ci
npm start
```

Follow the Expo prompts to run on Android, iOS, or web.

## Screens

- **LoginScreen** — Authenticate with username/password
- **HomeScreen** — Main menu with quick links
- **MyRecordsScreen** — View cached medical records
- **MedicationsScreen** — View current medications (to be built)
- **Lab ResultsScreen** — View lab results (to be built)
- **AppointmentsScreen** — Upcoming appointments (to be built)
- **NotificationsScreen** — Push notifications (to be built)
- **EmergencyInfoScreen** — Critical info for emergency access (to be built)

## Offline-First Architecture

The mobile app uses AsyncStorage for local caching and a sync queue system:

1. **Local Cache** — `AsyncStorage` stores all downloaded records
2. **Sync Queue** — `lib/sync.ts` queues actions when offline
3. **Auto-Sync** — When connection is restored, queued actions sync to server

### Sync Queue Usage

```typescript
import { syncQueue } from './lib/sync';

// Queue an action while offline
await syncQueue.add({
  action: 'create',
  resource: 'record',
  data: { /* record data */ }
});

// Sync all queued actions when online
const token = await AsyncStorage.getItem('token');
const results = await syncQueue.syncAll(token);
```

## Key Dependencies

- **Expo** — Managed React Native framework
- **React Navigation** — Navigation between screens
- **AsyncStorage** — Local persistent storage
- **Axios** — HTTP client for API calls

## Development

```bash
# Start development server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator
npm run ios

# Run on web
npm run web
```

## Build for Production

```bash
# Build for Android (APK/AAB)
eas build --platform android

# Build for iOS
eas build --platform ios
```

Requires EAS account: https://expo.dev/eas
