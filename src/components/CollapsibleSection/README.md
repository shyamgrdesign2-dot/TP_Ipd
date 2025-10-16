# CollapsibleSection Component

A dynamic, reusable collapsible section component that displays hierarchical data with expandable/collapsible functionality. Perfect for forms, dashboards, and data organization interfaces.

## Features

- ✅ **Dynamic Data Structure**: Accepts prop-based data for sections and children
- ✅ **Collapsible Interface**: Smooth expand/collapse animations
- ✅ **Status Indicators**: Visual indicators for data completion status
- ✅ **Responsive Design**: Mobile-friendly layout
- ✅ **Customizable Icons**: Support for custom icons per section/child
- ✅ **Event Callbacks**: Handlers for section toggle and child item clicks
- ✅ **Antd Integration**: Built with Ant Design components
- ✅ **SCSS Styling**: Comprehensive styling with theme support
- ✅ **Accessibility**: Keyboard navigation and screen reader support

## Installation

The component is already integrated into the project. Import it using:

```jsx
import CollapsibleSection from '../components/CollapsibleSection';
// or
import { CollapsibleSection } from '../components/CollapsibleSection';
```

## Props

### Main Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | `string` | - | Main section heading |
| `id` | `string` | - | Unique identifier for the section |
| `icon` | `string` | `provisionalDiagnosisPc` | Icon URL/path for the section |
| `isDataFilled` | `boolean` | `false` | Whether the section has data filled |
| `children` | `Array` | `[]` | Array of child items |
| `className` | `string` | `''` | Additional CSS classes |
| `onSectionToggle` | `Function` | - | Callback when section is toggled |
| `onChildClick` | `Function` | - | Callback when child item is clicked |
| `defaultExpanded` | `boolean` | `false` | Whether section is expanded by default |

### Children Object Structure

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `heading` | `string` | - | Child item heading |
| `id` | `string` | - | Child item unique identifier |
| `icon` | `string` | `provisionalDiagnosisPc` | Child item icon URL/path |
| `isDataFilled` | `boolean` | `false` | Whether child item has data filled |
| `status` | `string` | - | Status text for child item (optional) |
| `content` | `React.ReactNode` | - | Additional content for child item (optional) |

## Usage Examples

### Basic Usage

```jsx
import React from 'react';
import CollapsibleSection from '../components/CollapsibleSection';
import { provisionalDiagnosisPc } from '../assets/images/assessmentIcons';

const MyComponent = () => {
  const sectionData = {
    heading: "Diagnosis & Surgery",
    id: "diagnosis-surgery",
    icon: provisionalDiagnosisPc,
    isDataFilled: false,
    children: [
      {
        heading: "Final Diagnosis",
        id: "final-diagnosis",
        icon: provisionalDiagnosisPc,
        isDataFilled: false,
        status: "Not Filled Yet"
      },
      {
        heading: "Provisional Diagnosis",
        id: "provisional-diagnosis",
        icon: provisionalDiagnosisPc,
        isDataFilled: true,
        status: "Autofilled from Admi. Asses Form (24 Jun 2025)"
      }
    ]
  };

  return (
    <CollapsibleSection
      heading={sectionData.heading}
      id={sectionData.id}
      icon={sectionData.icon}
      isDataFilled={sectionData.isDataFilled}
      children={sectionData.children}
    />
  );
};
```

### With Event Handlers

```jsx
const handleSectionToggle = (sectionId, isExpanded) => {
  console.log(`Section ${sectionId} ${isExpanded ? 'expanded' : 'collapsed'}`);
};

const handleChildClick = (childId, childData) => {
  console.log(`Child ${childId} clicked:`, childData);
  // Navigate to form or open modal
};

<CollapsibleSection
  heading="Patient History"
  id="patient-history"
  icon={provisionalDiagnosisPc}
  isDataFilled={true}
  children={childrenData}
  onSectionToggle={handleSectionToggle}
  onChildClick={handleChildClick}
  defaultExpanded={true}
/>
```

### With Custom Content

```jsx
const childrenWithCustomContent = [
  {
    heading: "Custom Item",
    id: "custom-item",
    icon: provisionalDiagnosisPc,
    isDataFilled: true,
    status: "Completed",
    content: (
      <div className="custom-content">
        <p>Additional information or form elements</p>
        <button onClick={handleCustomAction}>Action Button</button>
      </div>
    )
  }
];
```

## Styling

The component uses SCSS for styling. Key CSS classes:

- `.collapsible-section` - Main container
- `.collapsible-section-header` - Section header
- `.children-container` - Children wrapper
- `.child-item` - Individual child item
- `.status-badge` - Status indicator
- `.filled` / `.not-filled` - Data status modifiers

### Customization

You can override styles by targeting the CSS classes:

```scss
.collapsible-section {
  .section-heading {
    color: your-custom-color;
  }
  
  .status-badge.filled {
    background: your-custom-background;
  }
}
```

## Data Status Logic

The component automatically calculates and displays data status:

- **Section Level**: Shows "X/Y Information Added" based on filled children
- **Child Level**: Shows individual status or "Not Filled Yet"
- **Visual Indicators**: Green for filled, gray for not filled

## Responsive Design

The component is fully responsive with:
- Mobile-optimized spacing and sizing
- Touch-friendly interactive elements
- Adaptive typography
- Flexible layout system

## Accessibility

- Keyboard navigation support
- ARIA labels and roles
- Screen reader compatibility
- Focus management
- High contrast support

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- React 16.8+
- Ant Design 4.0+
- SCSS support

## Contributing

When modifying this component:

1. Maintain prop interface compatibility
2. Update this README for new features
3. Test responsive behavior
4. Verify accessibility compliance
5. Update examples as needed

## License

This component is part of the PM Doctor Portal project.
