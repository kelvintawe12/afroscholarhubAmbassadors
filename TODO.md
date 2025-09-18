# TODO: Implement Toggle for Floating Action Buttons

## Current State Analysis
- FloatingActionButton component is always rendered in DashboardLayout.tsx
- No existing toggle mechanism exists in the UI
- Component renders based on user role (management, country_lead, ambassador, support)

## Implementation Plan

### 1. Add State Management
- [x] Add `showFloatingButtons` state to DashboardLayout component
- [x] Default to `false` to hide buttons initially
- [x] Persist state in localStorage for user preference

### 2. Create Toggle Button
- [x] Add small toggle button (plus icon) that shows when floating buttons are hidden
- [x] Position it at bottom-right with proper styling
- [x] Clicking it shows the full FloatingActionButton

### 3. Update DashboardLayout
- [x] Conditionally render FloatingActionButton based on state
- [x] Pass onClose callback to FloatingActionButton

### 4. Update FloatingActionButton
- [x] Add onClose prop to FloatingActionButton component
- [x] Call onClose when action is executed
- [x] Call onClose when clicking outside the FAB
- [x] Hide floating buttons after interaction

### 5. Testing
- [x] Test toggle functionality across different roles
- [x] Verify state persistence
- [x] Test on mobile and desktop

## Files Modified
- [x] src/components/layout/DashboardLayout.tsx
- [x] src/components/ui/FloatingActionButton.tsx

## Expected Outcome
- [x] Floating buttons are hidden by default
- [x] Users can click the small plus button to show floating buttons
- [x] Floating buttons hide after performing an action or clicking outside
- [x] State persists across page reloads
- [x] Clean UI when buttons are hidden
