import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import { provisionalDiagnosisPc } from '../../assets/images/assessmentIcons';

/**
 * Example usage of CollapsibleSection component
 * This demonstrates how to use the component with different data structures
 */
const ExampleUsage = () => {
  // Example data structure matching the image
  const sampleData = [
    {
      heading: "Basic Information",
      id: "basic-info",
      icon: provisionalDiagnosisPc,
      isDataFilled: true,
      children: [
        {
          heading: "Patient Demographics",
          id: "demographics",
          icon: provisionalDiagnosisPc,
          isDataFilled: true,
          status: "11/12 Information Added"
        }
      ]
    },
    {
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
        },
        {
          heading: "Surgeries Performed",
          id: "surgeries",
          icon: provisionalDiagnosisPc,
          isDataFilled: true,
          status: "Autofilled from OT notes (24 Jun 2025)"
        }
      ]
    },
    {
      heading: "Patient History",
      id: "patient-history",
      icon: provisionalDiagnosisPc,
      isDataFilled: false,
      children: [
        {
          heading: "Medical History",
          id: "medical-history",
          icon: provisionalDiagnosisPc,
          isDataFilled: true,
          status: "03/04 Information Added"
        },
        {
          heading: "Surgical History",
          id: "surgical-history",
          icon: provisionalDiagnosisPc,
          isDataFilled: false,
          status: "Not Filled Yet"
        }
      ]
    }
  ];

  const handleSectionToggle = (sectionId, isExpanded) => {
    console.log(`Section ${sectionId} ${isExpanded ? 'expanded' : 'collapsed'}`);
  };

  const handleChildClick = (childId, childData) => {
    console.log(`Child ${childId} clicked:`, childData);
    // Here you can navigate to the specific form or open a modal
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>CollapsibleSection Component Examples</h1>
      
      {sampleData.map((section) => (
        <CollapsibleSection
          key={section.id}
          heading={section.heading}
          id={section.id}
          icon={section.icon}
          isDataFilled={section.isDataFilled}
          children={section.children}
          onSectionToggle={handleSectionToggle}
          onChildClick={handleChildClick}
          defaultExpanded={section.id === 'diagnosis-surgery'} // Example: expand diagnosis section by default
        />
      ))}
      
      {/* Example with custom content in children */}
      <CollapsibleSection
        heading="Custom Content Example"
        id="custom-example"
        icon={provisionalDiagnosisPc}
        isDataFilled={true}
        children={[
          {
            heading: "Item with Custom Content",
            id: "custom-item",
            icon: provisionalDiagnosisPc,
            isDataFilled: true,
            status: "Completed",
            content: (
              <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                <p>This is custom content that can be added to any child item.</p>
                <button onClick={() => alert('Custom action!')}>Custom Action</button>
              </div>
            )
          }
        ]}
        onSectionToggle={handleSectionToggle}
        onChildClick={handleChildClick}
      />
    </div>
  );
};

export default ExampleUsage;
