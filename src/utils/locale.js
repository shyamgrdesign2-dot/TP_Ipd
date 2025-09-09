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
    basicInfoBg,
    aidKit,
    lab,
    obstetrics,
    medication,
    recordPad,
    ddx,
    vitals,
    galaxy,
    referDoctors,
    instructions,
    doc } from '../assets/images/icons';
    import {basic, functional, note, physical, treatmentPlan} from '../assets/images/icons/assessments';
export const IPD = {
  DEFAULT_ASSESSMENTS_FORM_STRUCTURE: [
    {
      id: 'basicInfo',
      title: 'Basic Info',
      icon: "basic",
      menuIcon: "basicInfoBg",
      enabled: true,
      expanded: false,
      children: [
        { placeholder: "", id: 'chiefComplaint', title: 'Chief Complaint', enabled: true, icon: "roundDotted" },
        {
          placeholder: "", id: 'historyPresentIllness',
          title: 'History of Present Illness',
          enabled: true,
          icon: "aidKit",
        },
        {
          placeholder: "", id: 'currentMedications',
          title: 'Current Medications (Rx)',
          enabled: true,
          icon: "medication",
        },
        { placeholder: "", id: 'investigations', title: 'Lab Results', enabled: true, icon: "lab" },
        { placeholder: "", id: 'pastMedicalHistory', title: 'Past Medical History', enabled: true, icon: "recordPad" },
        { placeholder: "", id: 'obstetricHistory', title: 'Obstetric History', enabled: true, icon: "obstetrics" },
        // { id: 'gh', title: 'Gynaec History', enabled: true, icon: " },"
      ],
    },
    {
      id: 'physicalExamination',
      title: 'Physical Examination',
      icon: "physical",
      menuIcon: "physicalExam",
      enabled: true,
      expanded: false,
      children: [
        { placeholder: "", id: 'examinations', title: 'Examinations', enabled: true, icon: "aidKit" },
        { placeholder: "", id: 'vitals', title: 'Vitals', enabled: true, icon: "vitals" },
        { placeholder: "", id: 'others', title: 'Others', enabled: true, icon: "galaxy" },
        {
          placeholder: "", 
          id: 'provisionalDiagnosis',
          title: 'Provisional Diagnosis',
          enabled: true,
          icon: "ddx",
        },
      ],
    },
    {
      id: 'functionalAssessment',
      title: 'Functional Assessment',
      icon: "functional",
      menuIcon: "funcAssess",
      enabled: true,
      expanded: false,
      children: [
        { placeholder: "", id: 'assessment', title: 'Assessment', enabled: true, },
        { placeholder: "", id: 'others', title: 'Others', enabled: true, icon: "galaxy" },
        {
          placeholder: "",
          id: 'referredToPhysiotherapy',
          title: 'Referred To Physiotherapy for Review',
          enabled: true,
          icon: "referDoctors"
        },
      ],
    },
    {
      id: 'treatmentPlan',
      icon: "treatmentPlan",
      menuIcon: "treatment",
      title: 'Treatment Plan',
      enabled: true,
      expanded: false,
      children: [
        {
          placeholder: "",
          id: 'immediateManagement',
          title: 'Immediate Management',
          enabled: true,
          icon: "recordPad"
        },
        { placeholder: "", id: 'monitoringPlan', title: 'Monitoring Plan', enabled: true, icon: "vitals" },
      ],
    },
    {
      id: 'additionalNotes',
      icon: "note",
      menuIcon: "noteColoured",
      title: 'Additional Notes',
      enabled: true,
      expanded: false,
      children: [
        {
          placeholder: "",
          id: 'specialInstructions',
          title: 'Special Instructions',
          enabled: true,
          icon: "instructions"
        },
        { placeholder: "", id: 'dischargeCriteria', title: 'Discharge Criteria', enabled: true, icon: "doc" },
      ],
    },
  ],
  ASSESSMENTS_MENU: [
    { id: 'basic', name: 'Basic Info', icon: "basicInfoBg", renderSection: () => <>hello basic</>, isActive: true },
    { id: 'pe', name: 'Physical Exam.', icon: "physicalExam" },
    { id: 'func', name: 'Funct. Assess.', icon: "funcAssess" },
    {
      id: 'plan',
      name: 'Treatment Plan',
      icon: "treatment",
      isEditable: true,
    },
    { id: 'note', name: 'Note', icon: "noteColoured" },
  ],
  PATIENT_DETAILS_MENU: [
    {
      id: 'assessment',
      name: 'Assessment',
      mainHeading: 'Admission Assessment',
      icon: "cardiogramColouredIcon",
      isActive: true,
      isEditable: false,
    },
    {
      id: 'progress',
      name: 'Progress Notes',
      icon: "noteIcon",
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
    { id: 'filledBy', name: 'Filled By' },
    { id: 'clinicalAssessment', name: 'Clinical Assessment & Plan', icon: basicInfoBg, isActive: true },
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
