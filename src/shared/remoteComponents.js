import React from 'react';

const normalizeToDefault = (m, key) => {
  if (key && m[key]) return { default: m[key] };
  if (m?.default) return { default: m.default };
  if (typeof m === 'function') return { default: m };
  throw new Error('Remote module does not export a React component.');
};

// Centralized component loading
const loadComponent = (componentName) => {
  return React.lazy(() =>
    import('shared_ui/components').then((m) => normalizeToDefault(m, componentName))
  );
};

// Pre-define all shared components
export const RemoteComponents = {
  LayoutWithMenu: loadComponent('LayoutWithMenu'),
  Customization: loadComponent('Customization'),
  CollapsibleWrapper: loadComponent('CollapsibleWrapper'),
  GenericCard: loadComponent('GenericCard'),
  RichTextEditWrapper: loadComponent('RichTextEditWrapper'),
  GenericTable: loadComponent('GenericTable'),
  SectionedTable: loadComponent('SectionedTable'),
  UnitInput: loadComponent('UnitInput'),
  AutoFillButton: loadComponent('AutoFillButton'),
  RichTextEditor: loadComponent('RichTextEditor'),
};

export const withRemoteComponent = (WrappedComponent) => {
  return function WithRemoteComponentWrapper(props) {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <WrappedComponent {...props} />
      </React.Suspense>
    );
  };
};

export const createRemoteComponent = (componentName, customFallback) => {
  const Component = RemoteComponents[componentName];
  return function RemoteComponentWrapper(props) {
    return (
      <React.Suspense fallback={customFallback || <div>Loading...</div>}>
        <Component {...props} />
      </React.Suspense>
    );
  };
};
