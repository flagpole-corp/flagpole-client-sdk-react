# @flagpole/client-react-sdk

A React SDK for integrating feature flags into your application.

## Features

- Real-time feature flag updates via WebSocket
- Environment-based flag configuration
- Simple API key authentication
- TypeScript support
- Zero configuration required

## Installation

```bash
npm install @flagpole/client-react-sdk
```

## Usage

### Basic Implementation

```tsx
import {
  FeatureFlagProvider,
  useFeatureFlag,
} from "@flagpole/client-react-sdk";

// Wrap your app with the provider
function App() {
  return (
    <FeatureFlagProvider apiKey="your_api_key_here" environment="development">
      <YourApp />
    </FeatureFlagProvider>
  );
}

// Use flags in your components
function MyComponent() {
  const { isFeatureEnabled } = useFeatureFlags();

  return (
    <div>
      {isFeatureEnabled("new-feature") && <div>This is a new feature!</div>}
    </div>
  );
}
```

### Available Hooks

```typescript
// Check a specific flag
const isEnabled = useFeatureFlag("feature-name");

// Access all flags and metadata
const { flags, isLoading, error, isFeatureEnabled } = useFeatureFlags();
```

### HOC Usage

```typescript
import { withFeatureFlag } from "@flagpole/client-react-sdk";

const MyComponent = ({ title }) => <div>{title}</div>;

// Wrap component with feature flag
const FeatureFlaggedComponent = withFeatureFlag(MyComponent, "feature-name");

// Optional fallback component
const FeatureFlaggedWithFallback = withFeatureFlag(
  MyComponent,
  "feature-name",
  FallbackComponent
);
```

## Development

### Prerequisites

- Node.js >= 16
- npm >= 7

### Local Development

1. Clone the repository

```bash
git clone [repository-url]
cd client-react-sdk
```

2. Install dependencies

```bash
npm install
```

3. Start development build

```bash
npm run build:watch
```

### Testing with Local Projects

1. Install yalc globally

```bash
npm install -g yalc
```

2. Build and publish to local yalc store

```bash
npm run build
yalc publish
```

3. In your test project

```bash
yalc add @flagpole/client-react-sdk
```

4. To update after making changes

```bash
# In SDK directory
npm run build
yalc push

# Or use watch mode
npm run build:watch
yalc push --watch
```

## Configuration

### Environment Variables

None required! The SDK works out of the box with default configurations.

### Provider Props

| Prop        | Type   | Required | Default       | Description                              |
| ----------- | ------ | -------- | ------------- | ---------------------------------------- |
| apiKey      | string | Yes      | -             | Your API key from the FlagPole dashboard |
| environment | string | No       | 'development' | Environment for feature flags            |

## Error Handling

The SDK includes built-in error handling and will return `false` for any feature flags when:

- The connection fails
- The API key is invalid
- The flag doesn't exist

You can access error states through the `useFeatureFlags` hook:

```typescript
const { error, isLoading } = useFeatureFlags();

if (isLoading) return <Loading />;
if (error) return <Error message={error.message} />;
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Support

For support, contact [support email/link]
