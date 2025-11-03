# DynamicPickerTable Component

A flexible, reusable table component with drag-and-drop functionality, dynamic columns, search capabilities, and imperative API methods.

## Features

- **Dynamic Columns**: Configure columns with different types (input, select, date, badge, custom render)
- **Drag & Drop**: Reorder rows with smooth drag-and-drop interaction
- **Search & Select**: Built-in search functionality with customizable options
- **Imperative API**: Access table data and methods via ref
- **Editable Cells**: Support for various input types in table cells
- **Responsive Design**: Mobile-friendly with proper styling

## Basic Usage

```jsx
import React, { useRef } from 'react';
import { DynamicPickerTable } from './components/DynamicPickerTable';

const MyComponent = () => {
  const tableRef = useRef();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      type: 'select',
      options: [
        { label: '1 day', value: '1 day' },
        { label: '3 days', value: '3 days' },
        { label: '5 days', value: '5 days' },
      ]
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      type: 'input',
      placeholder: 'Enter notes...'
    }
  ];

  const initialData = [
    {
      key: 'row_1',
      id: 1,
      name: 'Item 1',
      duration: '3 days',
      notes: ''
    }
  ];

  const handleSearch = async (query) => {
    // Your search API call
    return await searchAPI(query);
  };

  return (
    <DynamicPickerTable
      ref={tableRef}
      columns={columns}
      initialData={initialData}
      onSearch={handleSearch}
      searchPlaceholder="Search items..."
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isEditable` | boolean | `true` | Whether the table is editable |
| `rootClassName` | string | `""` | Additional CSS class for the container |
| `columns` | array | `[]` | Column configuration array |
| `initialData` | array | `[]` | Initial data for the table |
| `searchConfig` | object | `{}` | Search configuration options |
| `onSearch` | function | - | Search function that returns a promise |
| `onRowChange` | function | - | Callback when a row is updated |
| `onRowDelete` | function | - | Callback when a row is deleted |
| `onRowAdd` | function | - | Callback when a row is added |
| `emptyText` | string | `"No data added"` | Text shown when table is empty |
| `searchPlaceholder` | string | `"Search..."` | Placeholder for search input |

## Column Configuration

Each column object can have the following properties:

```jsx
{
  title: 'Column Title',        // Column header text
  dataIndex: 'fieldName',       // Field name in data object
  key: 'uniqueKey',            // Unique key for the column
  type: 'input',               // Column type: 'input', 'select', 'date', 'badge'
  width: 120,                  // Column width
  placeholder: 'Enter value',   // Placeholder text
  className: 'custom-class',    // CSS class for the column
  
  // Type-specific props
  options: [...],              // For 'select' type
  inputProps: {...},           // For 'input' type
  selectProps: {...},          // For 'select' type
  dateProps: {...},            // For 'date' type
  badgeClass: 'badge-primary', // For 'badge' type
  
  // Custom render function
  render: (text, record, updateFn) => {
    return <CustomComponent />;
  }
}
```

## Column Types

### Input Type
```jsx
{
  title: 'Notes',
  dataIndex: 'notes',
  type: 'input',
  placeholder: 'Enter notes...',
  inputProps: {
    maxLength: 100,
    style: { width: '100%' }
  }
}
```

### Select Type
```jsx
{
  title: 'Duration',
  dataIndex: 'duration',
  type: 'select',
  placeholder: 'Select duration',
  options: [
    { label: '1 day', value: '1 day' },
    { label: '3 days', value: '3 days' },
  ],
  selectProps: {
    allowClear: true
  }
}
```

### Date Type
```jsx
{
  title: 'Given Date',
  dataIndex: 'givenDate',
  type: 'date',
  placeholder: 'Select date',
  dateProps: {
    format: 'DD MMM YYYY',
    disabledDate: (current) => current && current < moment().startOf('day')
  }
}
```

### Badge Type
```jsx
{
  title: 'Status',
  dataIndex: 'status',
  type: 'badge',
  badgeClass: 'badge-primary'
}
```

## Search Configuration

```jsx
const searchConfig = {
  valueField: 'name',           // Field to use as option value
  titleField: 'name',           // Field to display as title
  subtitleField: 'code',        // Field to display as subtitle
  preventDuplicates: true,      // Prevent adding duplicate items
  duplicateCheckField: 'id',    // Field to check for duplicates
  
  // Custom option renderer
  renderOption: (item) => (
    <div className="custom-option">
      <span>{item.name}</span>
      <span className="code">[{item.code}]</span>
    </div>
  )
};
```

## Imperative API Methods

Access these methods via ref:

```jsx
const tableRef = useRef();

// Get all rows
const rows = tableRef.current.getRows();

// Save/get rows (alias for getRows)
const savedRows = tableRef.current.saveRows();

// Set rows programmatically
tableRef.current.setRows(newRowsArray);

// Add a single row
const newRow = { id: 1, name: 'New Item' };
tableRef.current.addRow(newRow);

// Update a specific row
tableRef.current.updateRow('row_key', { name: 'Updated Name' });

// Delete a row by key
tableRef.current.deleteRow('row_key');

// Clear all rows
tableRef.current.clearRows();
```

## Event Handlers

### onRowChange
Called when any cell value changes:
```jsx
const handleRowChange = (updatedRow, field, newValue) => {
  console.log('Row updated:', updatedRow);
  console.log('Field changed:', field);
  console.log('New value:', newValue);
};
```

### onRowAdd
Called when a new row is added via search:
```jsx
const handleRowAdd = (newRow) => {
  console.log('New row added:', newRow);
  // Perform additional actions like API calls
};
```

### onRowDelete
Called when a row is deleted:
```jsx
const handleRowDelete = (deletedRow) => {
  console.log('Row deleted:', deletedRow);
  // Perform cleanup or API calls
};
```

## Styling

The component uses CSS classes that can be customized:

- `.dynamic-picker-container` - Main container
- `.dynamic-picker-table` - Table wrapper
- `.dynamic-picker-search` - Search input wrapper
- `.badge` - Badge elements
- `.option-row` - Search option rows

## Example: Medication Picker

See `MedicationPickerExample.jsx` for a complete implementation example with:
- Medication search functionality
- Duration selection
- Date picker for given date
- Notes input
- Badge display for medication codes
- All imperative API methods demonstrated

## Dependencies

- React 16.8+
- Ant Design 4.x+
- @dnd-kit/core
- @dnd-kit/sortable
- dayjs (for date handling)
