// Static patients data
export const staticPatients = {
  patients: [
    {
      details: {
        id: "145303267914",
        name: "Abhishek Kunte",
        gender: "Male",
        age: 30,
        contact: "+91-9876543210",
      },
      ward: {
        id: 1,
        title: "General Ward",
      },
      room: {
        id: 101,
        title: "101",
      },
      doctor: {
        id: 524,
        name: "Dr. Ramesh Shah",
      },
      admittedOn: "2025-08-05T10:00:00.000Z",
      _id: "68ad7740ecbc6168f6270f9e",
      referral: false,
    },
    {
      details: {
        id: "P002",
        name: "Priya Desai",
        gender: "Female",
        age: 45,
        contact: "+91-9988776655",
      },
      ward: {
        id: 2,
        title: "ICU",
      },
      room: {
        id: 202,
        title: "202",
      },
      doctor: {
        id: 502,
        name: "Dr. Mehul Patel",
      },
      admittedOn: "2025-08-04T14:30:00.000Z",
      _id: "68ad7740ecbc6168f6270fc4",
      referral: false,
    },
    {
      details: {
        id: "P003",
        name: "Rajiv Nair",
        gender: "Male",
        age: 60,
        contact: "+91-9123456789",
      },
      ward: {
        id: 3,
        title: "Private Suite",
      },
      room: {
        id: 303,
        title: "303",
      },
      doctor: {
        id: 503,
        name: "Dr. Sneha Iyer",
      },
      admittedOn: "2025-08-03T09:15:00.000Z",
      _id: "68ad7740ecbc6168f6270f9f",
      referral: false,
    },
    {
      details: {
        id: "P004",
        name: "Sunita Mehra",
        gender: "Female",
        age: 55,
        contact: "+91-9812345670",
      },
      ward: {
        id: 4,
        title: "Surgical Ward",
      },
      room: {
        id: 401,
        title: "401",
      },
      doctor: {
        id: 504,
        name: "Dr. Anil Kumar",
      },
      admittedOn: "2025-08-02T11:45:00.000Z",
      _id: "68ad7740ecbc6168f6270fa0",
      referral: false,
    },
    {
      details: {
        id: "P005",
        name: "Vikram Singh",
        gender: "Male",
        age: 38,
        contact: "+91-9911223344",
      },
      ward: {
        id: 5,
        title: "Pediatric Ward",
      },
      room: {
        id: 502,
        title: "502",
      },
      doctor: {
        id: 505,
        name: "Dr. Ritu Sharma",
      },
      admittedOn: "2025-08-01T08:00:00.000Z",
      _id: "68ad7740ecbc6168f6270fab",
      referral: false,
    },
    {
      details: {
        id: "P006",
        name: "Neha Gupta",
        gender: "Female",
        age: 29,
        contact: "+91-9001122334",
      },
      ward: {
        id: 6,
        title: "Maternity Ward",
      },
      room: {
        id: 601,
        title: "601",
      },
      doctor: {
        id: 506,
        name: "Dr. Kavita Joshi",
      },
      admittedOn: "2025-07-31T17:20:00.000Z",
      _id: "68ad7740ecbc6168f6270fc5",
      referral: false,
    },
    {
      details: {
        id: "P007",
        name: "Amit Verma",
        gender: "Male",
        age: 42,
        contact: "+91-9234567890",
      },
      ward: {
        id: 7,
        title: "Cardiology",
      },
      room: {
        id: 701,
        title: "701",
      },
      doctor: {
        id: 507,
        name: "Dr. Sanjay Kapoor",
      },
      admittedOn: "2025-07-30T19:05:00.000Z",
      _id: "68ad7740ecbc6168f6270fa1",
      referral: false,
    },
    {
      details: {
        id: "P008",
        name: "Kiran Yadav",
        gender: "Female",
        age: 50,
        contact: "+91-9543210987",
      },
      ward: {
        id: 8,
        title: "Neurology",
      },
      room: {
        id: 801,
        title: "801",
      },
      doctor: {
        id: 508,
        name: "Dr. Alok Mishra",
      },
      admittedOn: "2025-07-29T15:40:00.000Z",
      _id: "68ad7740ecbc6168f6270fc6",
      referral: false,
    },
    {
      details: {
        id: "P009",
        name: "Manoj Joshi",
        gender: "Male",
        age: 65,
        contact: "+91-9123987654",
      },
      ward: {
        id: 9,
        title: "Oncology",
      },
      room: {
        id: 901,
        title: "901",
      },
      doctor: {
        id: 509,
        name: "Dr. Preeti Deshmukh",
      },
      admittedOn: "2025-07-28T13:10:00.000Z",
      _id: "68ad7740ecbc6168f6270fbc",
      referral: false,
    },
    {
      details: {
        id: "P010",
        name: "Sneha Kulkarni",
        gender: "Female",
        age: 35,
        contact: "+91-9456781230",
      },
      ward: {
        id: 10,
        title: "Orthopedics",
      },
      room: {
        id: 1001,
        title: "1001",
      },
      doctor: {
        id: 510,
        name: "Dr. Manoj Thakur",
      },
      admittedOn: "2025-07-27T09:50:00.000Z",
      _id: "68ad7740ecbc6168f6270fac",
      referral: false,
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 50,
    totalPages: 5,
  },
};

// Static wards data
export const staticWards = [
  {
    id: "1",
    title: "General Ward",
  },
  {
    id: "2",
    title: "ICU",
  },
  {
    id: "3",
    title: "Private Suite",
  },
  {
    id: "4",
    title: "Surgical Ward",
  },
  {
    id: "5",
    title: "Pediatric Ward",
  },
  {
    id: "6",
    title: "Maternity Ward",
  },
  {
    id: "7",
    title: "Cardiology",
  },
  {
    id: "8",
    title: "Neurology",
  },
  {
    id: "9",
    title: "Oncology",
  },
  {
    id: "10",
    title: "Orthopedics",
  },
  {
    id: "12",
    title: "ICU",
  },
];

// Static doctors data
export const staticDoctors = [
  {
    id: "502",
    name: "Dr. Mehul Patel",
  },
  {
    id: "503",
    name: "Dr. Sneha Iyer",
  },
  {
    id: "504",
    name: "Dr. Anil Kumar",
  },
  {
    id: "505",
    name: "Dr. Ritu Sharma",
  },
  {
    id: "506",
    name: "Dr. Kavita Joshi",
  },
  {
    id: "507",
    name: "Dr. Sanjay Kapoor",
  },
  {
    id: "508",
    name: "Dr. Alok Mishra",
  },
  {
    id: "509",
    name: "Dr. Preeti Deshmukh",
  },
  {
    id: "510",
    name: "Dr. Manoj Thakur",
  },
  {
    id: "511",
    name: "Dr. Seema Agarwal",
  },
  {
    id: "512",
    name: "Dr. Vivek Prasad",
  },
  {
    id: "513",
    name: "Dr. Sunil Rao",
  },
  {
    id: "514",
    name: "Dr. Vivek Prasad",
  },
  {
    id: "515",
    name: "Dr. Seema Agarwal",
  },
  {
    id: "516",
    name: "Dr. Pooja Kulkarni",
  },
  {
    id: "517",
    name: "Dr. Divya Singh",
  },
  {
    id: "518",
    name: "Dr. Pooja Kulkarni",
  },
  {
    id: "519",
    name: "Dr. Sunil Rao",
  },
  {
    id: "520",
    name: "Dr. Seema Agarwal",
  },
  {
    id: "521",
    name: "Dr. Divya Singh",
  },
  {
    id: "522",
    name: "Dr. Pooja Kulkarni",
  },
  {
    id: "523",
    name: "Dr. Rajesh Gupta",
  },
  {
    id: "524",
    name: "Dr. Ramesh Shah",
  },
  {
    id: "5288",
    name: "Dr. Vivek Prasad",
  },
  {
    id: "525",
    name: "Dr. Rajesh Gupta",
  },
  {
    id: "526",
    name: "Dr. Vivek Prasad",
  },
  {
    id: "527",
    name: "Dr. Rajesh Gupta",
  },
  {
    id: "528",
    name: "Dr. Divya Singh",
  },
  {
    id: "529",
    name: "Dr. Nitin Sharma",
  },
  {
    id: "530",
    name: "Dr. Pooja Kulkarni",
  },
  {
    id: "531",
    name: "Dr. Nitin Sharma",
  },
  {
    id: "532",
    name: "Dr. Pooja Kulkarni",
  },
  {
    id: "533",
    name: "Dr. Sunil Rao",
  },
  {
    id: "534",
    name: "Dr. Sunil Rao",
  },
  {
    id: "535",
    name: "Dr. Vivek Prasad",
  },
  {
    id: "536",
    name: "Dr. Rajesh Gupta",
  },
  {
    id: "537",
    name: "Dr. Divya Singh",
  },
  {
    id: "538",
    name: "Dr. Seema Agarwal",
  },
  {
    id: "539",
    name: "Dr. Vivek Prasad",
  },
  {
    id: "540",
    name: "Dr. Seema Agarwal",
  },
  {
    id: "541",
    name: "Dr. Rajesh Gupta",
  },
  {
    id: "542",
    name: "Dr. Rajesh Gupta",
  },
  {
    id: "543",
    name: "Dr. Vivek Prasad",
  },
  {
    id: "544",
    name: "Dr. Divya Singh",
  },
  {
    id: "545",
    name: "Dr. Divya Singh",
  },
  {
    id: "546",
    name: "Dr. Vivek Prasad",
  },
  {
    id: "547",
    name: "Dr. Seema Agarwal",
  },
  {
    id: "548",
    name: "Dr. Nitin Sharma",
  },
  {
    id: "549",
    name: "Dr. Divya Singh",
  },
  {
    id: "550",
    name: "Dr. Vivek Prasad",
  },
];

// Format patient data for the table
export const formatPatientsForTable = (patients) => {
  return patients?.map((patient) => {
    return ({
      id: patient._id,
      isDischarged: patient.isDischarged,
      dischargedAt: patient.dischargedAt,
      patientId: patient.details.id,
      patientName: patient.details.name,
      gender: patient.details.gender,
      age: patient.details.age,
      contactNumber: patient.details.contact,
      ward: patient.ward.title,
      room: patient.room.title,
      bedNumber: patient.room.title,
      doctorName: patient.doctor.name,
      doctorId: patient.doctor.id,
      mrno: patient.mrno,
      admissionNo: patient.admissionNo,
      admissionId: patient.admissionId,
      dischargeNo: patient.dischargeNo,
      dateOfDischarge: patient.dateOfDischarge,
      timeOfDischarge: patient.timeOfDischarge,
      dischargeType: patient.dischargeType,
      dischargeRemarks: patient.dischargeRemarks,
      admittedOn: patient.admittedOn,
      referral: patient.referral,
      patientData: patient,
    });
  });
};
