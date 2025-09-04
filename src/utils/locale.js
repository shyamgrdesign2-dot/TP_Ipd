import { 
    healthIcon,
    notesIcon,
    glassIcon,
    notepadIcon,
    cardiogramColouredIcon,
    roundDotted,
    noteIcon,
    usersTwoIcon,
    layerIcon,
    basicInfo,
    physicalExam,
    funcAssess,
    treatment,
    noteColoured,
    basicInfoBg, } from '../assets/images/icons';
    import {basic, functional, note, physical, treatmentPlan} from '../assets/images/icons/assessments';
export const IPD = {
  DEFAULT_ASSESSMENTS_FORM_STRUCTURE: [
    {
      id: 'basic',
      order: 1,
      title: 'Basic Info',
      icon: basic,
      enabled: true,
      expanded: false,
      children: [
        { id: 'chief', order: 1, title: 'Chief Complaint', enabled: true },
        {
          id: 'hpi',
          order: 0,
          title: 'History of Present Illness',
          enabled: true,
        },
        {
          id: 'rx',
          order: 2,
          title: 'Current Medications (Rx)',
          enabled: true,
        },
        { id: 'inv', order: 3, title: 'Investigations', enabled: true },
        { id: 'pmh', order: 4, title: 'Past Medical History', enabled: true },
        { id: 'oh', order: 5, title: 'Obstetric History', enabled: true },
        { id: 'gh', order: 6, title: 'Gynaec History', enabled: true },
      ],
    },
    {
      id: 'physical',
      order: 0,
      title: 'Physical Examination',
      icon: physical,
      enabled: true,
      expanded: false,
      children: [
        { id: 'vitals', order: 0, title: 'Vitals', enabled: true },
        { id: 'examinations', order: 1, title: 'Examinations', enabled: true },
        { id: 'others', order: 2, title: 'Others', enabled: true },
        {
          id: 'provisionalDiagnosis',
          order: 3,
          title: 'Provisional Diagnosis',
          enabled: true,
        },
      ],
    },
    {
      id: 'functional',
      order: 2,
      title: 'Functional Assessment',
      icon: functional,
      enabled: true,
      expanded: false,
      children: [
        { id: 'assessment', order: 0, title: 'Assessment', enabled: true },
        { id: 'others', order: 1, title: 'Others', enabled: true },
        {
          id: 'referredToPhysiotherapy',
          order: 2,
          title: 'Referred To Physiotherapy for Review',
          enabled: true,
        },
      ],
    },
    {
      id: 'treatmentPlan',
      icon: treatmentPlan,
      order: 3,
      title: 'Treatment Plan',
      enabled: true,
      expanded: false,
      children: [
        {
          id: 'immediateManagement',
          order: 0,
          title: 'Immediate Management',
          enabled: true,
        },
        { id: 'monitoringPlan', order: 1, title: 'Monitoring Plan', enabled: true },
      ],
    },
    {
      id: 'additionalNotes',
      icon: note,
      order: 4,
      title: 'Additional Notes',
      enabled: true,
      expanded: false,
      children: [
        {
          id: 'specialInstructions',
          order: 0,
          title: 'Special Instructions',
          enabled: true,
        },
        { id: 'dischargeCriteria', order: 1, title: 'Discharge Criteria', enabled: true },
      ],
    },
  ],
  ASSESSMENTS_MENU: [
    { id: 'basic', name: 'Basic Info', icon: basicInfoBg, renderSection: () => <>hello basic</>, isActive: true },
    { id: 'pe', name: 'Physical Exam.', icon: physicalExam },
    { id: 'func', name: 'Funct. Assess.', icon: funcAssess },
    {
      id: 'plan',
      name: 'Treatment Plan',
      icon: treatment,
      isEditable: true,
    },
    { id: 'note', name: 'Note', icon: noteColoured },
  ],
  PATIENT_DETAILS_MENU: [
    {
      id: 'assessment',
      name: 'Assessment',
      mainHeading: 'Admission Assessment',
      icon: cardiogramColouredIcon,
      isActive: true,
      isEditable: false,
    },
    {
      id: 'progress',
      name: 'Progress Notes',
      icon: noteIcon,
      isEditable: false,
    },
    { id: 'consultantNotes', name: 'Consultant Notes',
      mainHeading: 'Consultant Notes',
      icon: notepadIcon },
    { id: 'ot', name: 'OT Notes', icon: healthIcon },
    { id: 'lab', name: 'Lab Results', icon: glassIcon },
    { id: 'records', name: 'Medical Records', icon: notesIcon },
    { id: 'discharge', name: 'Discharge Summary', icon: notepadIcon },
    { id: 'logs', name: 'Activity Logs', icon: usersTwoIcon },
    { id: 'opd', name: 'OPD Visit History', icon: layerIcon },
  ],
  VITALS : [
    {
      name: 'pulse',
      label: 'Pulse',
      unit: '/min',
    },
    {
      name: 'bloodPressure',
      label: 'Blood Pressure',
      unit: 'mmHg',
    },
    {
      name: 'temperature',
      label: 'Temperature',
      unit: '°F',
    },
    {
      name: 'spo2',
      label: 'SpO2',
      unit: '%',
    },
    {
      name: 'respiratoryRate',
      label: 'Respiratory Rate',
      unit: 'mmHg',
    },
    {
      name: 'weight',
      label: 'Weight',
      unit: 'kg',
    },
    {
      name: 'height',
      label: 'Height',
      unit: 'cms',
    },
    {
      name: 'generalRbs',
      label: 'General RBS',
      unit: 'mg/dl',
    },
  ],
  EXAMINATION: [
    {
      title: 'CVS',
      description: '',
      options: [
        { label: 'WNL', value: 1, name: 'wnl' },
        { label: 'Abnormal', value: 2, name: 'abnormal' },
      ],
    },
    {
      title: 'Breast/Chest',
      description: '',
      options: [
        { label: 'WNL', value: 1, name: 'wnl' },
        { label: 'Abnormal', value: 2, name: 'abnormal' },
      ],
    },
    {
      title: 'Abdomen',
      description: '',
      options: [
        { label: 'WNL', value: 1, name: 'wnl' },
        { label: 'Abnormal', value: 2, name: 'abnormal' },
      ],
    },
    {
      title: 'Neurological/Psychosocial',
      description: '',
      options: [
        { label: 'WNL', value: 1, name: 'wnl' },
        { label: 'Abnormal', value: 2, name: 'abnormal' },
      ],
    },
    {
      title: 'Back',
      description: '',
      options: [
        { label: 'WNL', value: 1, name: 'wnl' },
        { label: 'Abnormal', value: 2, name: 'abnormal' },
      ],
    },
    {
      title: 'HEENT',
      description: '',
      options: [
        { label: 'WNL', value: 1, name: 'wnl' },
        { label: 'Abnormal', value: 2, name: 'abnormal' },
      ],
    },
  ],
  FUNCTIONAL_ASSESSMENT : [
    {
      key: 'bedActivity',
      title: 'Bed Activity',
      options: [
        { label: 'Independent', value: 1, name: 'independent' },
        {
          label: 'Needs Assistance',
          value: 2,
          name: 'needs-assistance',
        },
        { label: 'Dependent', value: 3, name: 'dependent' },
      ],
    },
    {
      key: 'sitting',
      title: 'Sitting',
      options: [
        { label: 'Independent', value: 1, name: 'independent' },
        {
          label: 'Needs Assistance',
          value: 2,
          name: 'needs-assistance',
        },
        { label: 'Dependent', value: 3, name: 'dependent' },
      ],
    },
    {
      key: 'standing',
      title: 'Standing',
      options: [
        { label: 'Independent', value: 1, name: 'independent' },
        {
          label: 'Needs Assistance',
          value: 2,
          name: 'needs-assistance',
        },
        { label: 'Dependent', value: 3, name: 'dependent' },
      ],
    },
    {
      key: 'ambulation',
      title: 'Ambulation',
      options: [
        { label: 'Independent', value: 1, name: 'independent' },
        {
          label: 'Needs Assistance',
          value: 2,
          name: 'needs-assistance',
        },
        { label: 'Dependent', value: 3, name: 'dependent' },
      ],
    },
    {
      key: 'stairClimbing',
      title: 'Stair Climbing',
      options: [
        { label: 'Independent', value: 1, name: 'independent' },
        {
          label: 'Needs Assistance',
          value: 2,
          name: 'needs-assistance',
        },
        { label: 'Dependent', value: 3, name: 'dependent' },
      ],
    },
    {
      key: 'bedSoreOnAdmission',
      title: 'Bed Sore on Admission',
      options: [
        { label: 'Yes', value: 1, name: 'yes' },
        { label: 'No', value: 2, name: 'no' },
      ],
    },
  ],
  CONSULTANT_NOTES_MENU: [
    { id: 'clinicalAssessment', name: 'Clinical Assessment & Plan', icon: basicInfoBg, renderSection: () => <>hello basic</>, isActive: true },
    { id: 'vitals', name: 'Vitals', icon: physicalExam },
    { id: 'medication', name: 'Medication', icon: funcAssess },
    {
      id: 'labInvestigation',
      name: 'Lab Investigation',
      icon: treatment,
      isEditable: true,
    },
    { id: 'remarks', name: 'Remarks', icon: noteColoured },
  ],
  CONSULTANT_NOTES_VITALS : [
    {
      name: 'bloodPressure',
      label: 'Blood Pressure',
      unit: 'mmHg',
    },
    {
      name: 'temperature',
      label: 'Temperature',
      unit: '°F',
    },
    {
      name: 'pulse',
      label: 'Heart Rate',
      unit: '/min',
    },
    {
      name: 'respiratoryRate',
      label: 'Respiratory Rate',
      unit: 'mmHg',
    }
  ],
};
