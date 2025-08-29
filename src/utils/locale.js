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
export const IPD = {
    
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
    { id: 'consult', name: 'Consultant Notes', icon: notepadIcon },
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
  ]
};
