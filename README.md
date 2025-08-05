# Bulk Permissions Modal

A React TypeScript modal component for changing bulk user permissions, built based on the Figma design.

## Features

- ✅ Matches the exact Figma design specifications
- ✅ Fully functional dropdowns with proper state management
- ✅ Form validation (Save button disabled until required fields are filled)
- ✅ Responsive design with proper hover states
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Clean, reusable component architecture

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## Usage

The modal component can be used in any React application:

```tsx
import Modal from './components/Modal';

function YourComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedUsersCount={6}
      />
    </div>
  );
}
```

## Component Props

### Modal Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls modal visibility |
| `onClose` | `() => void` | - | Callback when modal is closed |
| `selectedUsersCount` | `number` | `6` | Number of selected users to display |

## Modal Features

1. **Action Selection**: Choose between "Add roles", "Remove roles", or "Replace roles"
2. **Role Types**: Select subscription-level roles and/or app-level roles
3. **Validation**: Save button is only enabled when an action and at least one role type is selected
4. **Accessibility**: Proper focus management and keyboard navigation

## Design System

The modal follows the design system with:
- **Colors**: Teal primary (#128297), Gray text (#2a2c35), and proper borders
- **Typography**: Inter font family with proper weights and sizes
- **Spacing**: Consistent padding and margins as per design
- **Interactive States**: Hover and focus states for all interactive elements

## Build

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory. 