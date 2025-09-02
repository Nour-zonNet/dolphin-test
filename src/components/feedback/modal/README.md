# Modal System Documentation

## Overview
This modal system provides a comprehensive, Redux Toolkit-based solution for managing modals in the LearnAtDolphin frontend application. It includes a centralized modal manager, multiple modal types, and a callback registry system to handle user interactions without violating Redux serialization requirements.

## Architecture

### Core Components
- **ModalManager**: Central component that renders modals based on Redux state
- **modalSlice**: Redux slice managing modal visibility, type, and props
- **useModal**: Custom hook providing convenient API for opening modals
- **Callback Registry**: External system for managing modal callbacks without Redux

### Key Features
- **Redux Integration**: Uses Redux Toolkit for state management
- **Serialization Safe**: No functions stored in Redux state
- **Type Safety**: Comprehensive modal type definitions
- **Tailwind Styling**: Consistent, responsive design
- **Callback Support**: Handles user confirmations and actions

## Modal Types

### Available Modals
1. **StatusModal** - Success, warning, and error messages
2. **BuyPackageModal** - Package purchase interface
3. **DetailsModal** - Package information display
4. **ConfirmModal** - User action confirmation
5. **ChangeGroupModal** - Group switching interface
6. **ReactivateModal** - Subscription reactivation
7. **ExtendPackageModal** - Package extension (uses BuyPackageModal with extend mode)

### Modal Type Constants
```javascript
export const MODAL_TYPES = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR", 
  WARNING: "WARNING",
  BUY_PACKAGE: "BUY_PACKAGE",
  DETAILS: "DETAILS",
  CONFIRM: "CONFIRM",
  CHANGE_GROUP: "CHANGE_GROUP",
  REACTIVATE: "REACTIVATE",
  EXTEND_PACKAGE: "EXTEND_PACKAGE"
};
```

## Usage

### Basic Modal Opening
```javascript
import { useModal } from '@/components/feedback/modal/useModal';

const MyComponent = () => {
  const { openConfirmModal } = useModal();
  
  const handleDelete = () => {
    openConfirmModal(
      { title: "Delete Item", message: "Are you sure?" },
      () => console.log("Item deleted") // Callback function
    );
  };
};
```

### Modal with Callback
```javascript
const { openChangeGroupModal } = useModal();

openChangeGroupModal(
  { currentGroup: "Group A", availableGroups: ["A", "B", "C"] },
  (selectedGroup) => {
    // This callback is executed when user confirms
    console.log("Changed to:", selectedGroup);
    // Update user's group in backend
  }
);
```

## Callback Registry Pattern

### Problem Solved
The callback registry pattern solves Redux serialization warnings by storing callback functions outside of Redux state. Functions cannot be serialized and stored in Redux, so we use a Map-based registry.

### How It Works
1. **Callback Storage**: When opening a modal with a callback, the function is stored in a Map with a unique ID
2. **ID Passing**: Only the callback ID is passed through Redux (serializable)
3. **Execution**: When the modal confirms, the callback is retrieved and executed using the ID
4. **Cleanup**: The callback is removed from the registry after execution

### Implementation
```javascript
// In useModal hook
const openConfirmModal = (modalData, onConfirm) => {
  const callbackId = Date.now().toString();
  if (onConfirm) {
    callbackRegistry.set(callbackId, onConfirm);
  }
  
  dispatch(openModal({
    type: MODAL_TYPES.CONFIRM,
    props: { modalData, callbackId: onConfirm ? callbackId : null }
  }));
};

// In ModalManager
const executeCallback = (callbackId, ...args) => {
  const callback = callbackRegistry.get(callbackId);
  if (callback) {
    callback(...args);
    callbackRegistry.delete(callbackId);
  }
};
```

## Styling

### Design Principles
- **Overlay**: Dark semi-transparent background
- **Card Layout**: White rounded cards with shadows
- **Responsive**: Mobile-first design with Tailwind CSS
- **Consistent**: Unified button styles and spacing

### Tailwind Classes Used
- **Container**: `fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`
- **Modal Card**: `bg-white rounded-lg shadow-xl max-w-md w-full mx-4`
- **Buttons**: `px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700`

## Customization

### Adding New Modal Types
1. **Create Component**: Build new modal component in `modals/` directory
2. **Add Type**: Extend `MODAL_TYPES` constant
3. **Update ModalManager**: Add case for new modal type
4. **Add Hook Method**: Create opening function in `useModal`

### Styling Modifications
- Override Tailwind classes in individual modal components
- Use CSS custom properties for theme-specific values
- Maintain consistent spacing and typography

## Best Practices

### Performance
- **Lazy Loading**: Modals are only rendered when needed
- **Callback Cleanup**: Registry automatically removes executed callbacks
- **Minimal Re-renders**: Redux state changes only when necessary

### Accessibility
- **Focus Management**: Proper focus trapping within modals
- **Keyboard Navigation**: ESC key closes modals
- **Screen Reader Support**: Semantic HTML and ARIA labels

### Error Handling
- **Callback Validation**: Check for callback existence before execution
- **Graceful Degradation**: Modals work without callbacks
- **Error Boundaries**: Catch and handle modal rendering errors

## Troubleshooting

### Common Issues

#### Redux Serialization Warning
**Problem**: "Redux expects actions and state to be serializable"
**Solution**: Use callback registry pattern - never store functions in Redux state

#### Modal Not Rendering
**Check**: 
- Modal type is correctly defined in `MODAL_TYPES`
- `ModalManager` case handles the modal type
- Redux state contains correct `type` and `props`

#### Callback Not Executing
**Check**:
- Callback function is provided when opening modal
- `callbackId` is correctly passed through props
- `executeCallback` is called with correct parameters

### Debug Mode
Enable Redux DevTools to inspect modal state:
```javascript
// In store configuration
const store = configureStore({
  reducer: { modal: modalSlice },
  devTools: process.env.NODE_ENV !== 'production'
});
```

## Examples

### Complete Modal Flow
```javascript
// 1. Open modal with callback
openConfirmModal(
  { title: "Delete", message: "Are you sure?" },
  () => deleteItem(itemId)
);

// 2. User sees modal with confirm/cancel buttons
// 3. User clicks confirm
// 4. Callback executes (deleteItem runs)
// 5. Modal closes automatically
// 6. Callback removed from registry
```

### Custom Modal Data
```javascript
openDetailsModal({
  name: "Premium Package",
  description: "Advanced features and support",
  price: 199,
  duration: "12 months",
  features: ["24/7 Support", "Advanced Analytics", "Custom Reports"]
});
```

## Migration Guide

### From Old Modal System
1. **Replace Direct Calls**: Use `useModal` hook instead of direct dispatch
2. **Update Props**: Ensure modal data matches new component expectations
3. **Handle Callbacks**: Use callback parameter instead of storing in Redux
4. **Test Functionality**: Verify all modals work with new system

### Breaking Changes
- Modal opening functions now take callback as second parameter
- Some modal props have been standardized
- Redux state structure has changed

## Future Enhancements

### Planned Features
- **Modal Stacking**: Support for multiple open modals
- **Animation System**: Smooth enter/exit transitions
- **Theme Support**: Dark/light mode variants
- **Internationalization**: Multi-language support

### Performance Optimizations
- **Virtual Scrolling**: For modals with long content lists
- **Code Splitting**: Lazy load modal components
- **Memoization**: Prevent unnecessary re-renders
