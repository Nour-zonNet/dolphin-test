# InfoModal Component

A reusable, flexible modal component for displaying information, collecting user input, and confirming actions.

## Features

- **Controlled**: Uses `open` and `onClose` props for state management
- **Flexible Content**: Supports title, optional description, and dynamic actions
- **Dynamic Actions**: Configurable array of buttons with custom labels, styles, and handlers
- **Responsive Design**: Mobile-first design with proper spacing and typography
- **Accessibility**: Proper focus management and keyboard navigation
- **Customizable**: Supports custom CSS classes for styling

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls modal visibility |
| `onClose` | `function` | - | Callback when modal should close |
| `title` | `string` | - | Modal title (required) |
| `description` | `string` | - | Optional description text |
| `actions` | `Action[]` | `[]` | Array of action buttons |
| `className` | `string` | `""` | Additional CSS classes for the modal |

## Action Object Structure

```typescript
interface Action {
  label: string;           // Button text
  onClick: () => void;     // Click handler
  className?: string;      // Optional custom CSS classes
  props?: object;          // Additional props passed to Button component
}
```

## Usage Examples

### Basic Info Modal

```jsx
import { useDispatch } from "react-redux";
import { showModal, hideModal } from "@/store/modalSlice";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";

const showBasicModal = () => {
  dispatch(showModal({
    type: MODAL_TYPES.INFO,
    props: {
      title: "Information",
      description: "This is a simple information modal.",
      actions: [
        {
          label: "OK",
          onClick: () => dispatch(hideModal())
        }
      ]
    }
  }));
};
```

### Payment Method Selection

```jsx
const showPaymentModal = () => {
  dispatch(showModal({
    type: MODAL_TYPES.INFO,
    props: {
      title: "Select Payment Method",
      description: "Choose your preferred payment method.",
      actions: [
        {
          label: "Credit Card",
          onClick: () => handlePaymentMethod("credit_card"),
          className: "bg-blue-500 hover:bg-blue-600 text-white"
        },
        {
          label: "PayPal",
          onClick: () => handlePaymentMethod("paypal"),
          className: "bg-blue-600 hover:bg-blue-700 text-white"
        },
        {
          label: "Cancel",
          onClick: () => dispatch(hideModal()),
          className: "bg-gray-300 hover:bg-gray-400 text-gray-700"
        }
      ]
    }
  }));
};
```

### Action Confirmation

```jsx
const showConfirmModal = (actionName, onConfirm) => {
  dispatch(showModal({
    type: MODAL_TYPES.INFO,
    props: {
      title: "Confirm Action",
      description: `Are you sure you want to ${actionName}? This action cannot be undone.`,
      actions: [
        {
          label: "Cancel",
          onClick: () => dispatch(hideModal()),
          className: "bg-gray-300 hover:bg-gray-400 text-gray-700"
        },
        {
          label: "Confirm",
          onClick: () => {
            onConfirm();
            dispatch(hideModal());
          },
          className: "bg-red-500 hover:bg-red-600 text-white"
        }
      ]
    }
  }));
};
```

### Custom Styled Modal

```jsx
const showCustomModal = () => {
  dispatch(showModal({
    type: MODAL_TYPES.INFO,
    props: {
      title: "Custom Styled Modal",
      description: "This modal has custom styling applied.",
      className: "max-w-lg bg-gradient-to-br from-blue-50 to-indigo-100",
      actions: [
        {
          label: "Primary Action",
          onClick: () => handlePrimaryAction(),
          className: "bg-indigo-600 hover:bg-indigo-700 text-white"
        },
        {
          label: "Secondary",
          onClick: () => dispatch(hideModal()),
          className: "bg-white border border-indigo-300 text-indigo-600 hover:bg-indigo-50"
        }
      ]
    }
  }));
};
```

## Integration with Redux Store

The InfoModal integrates with the existing modal system:

1. **Show Modal**: Use `dispatch(showModal({ type: MODAL_TYPES.INFO, props: {...} }))`
2. **Hide Modal**: Use `dispatch(hideModal())`
3. **Modal State**: Access via `useSelector((state) => state.modal)`

## Styling

The component uses Tailwind CSS classes and follows the existing design system:
- Font family: `font-cairo` (consistent with other components)
- Color scheme: Gray scale for text, customizable for actions
- Spacing: Consistent with other modals (mt-6, mt-4, mt-8)
- Responsive: Mobile-first with responsive text sizes

## Accessibility

- Proper focus management
- Keyboard navigation support
- Screen reader friendly
- High contrast design
- Proper ARIA attributes
