export async function fetchDiagnosesAPI(query) {
  const MOCK = [
    {
      objectID: "7d8b6d8b-8656-4a6a-8e73-44a039c12053",
      tds_id: 20747,
      pms_default: 0,
      icd_code: "",
      tds_name: "Viral Fever",
      count: 4,
    },
    {
      objectID: "285033a2-3f6d-4cb9-8adc-245e47674aff",
      tds_id: 20799,
      pms_default: 0,
      icd_code: "",
      tds_name: "hello",
      count: 3,
    },
    {
      objectID: "af027b88-127b-48f6-ba7a-e04b6f8afada",
      tds_id: 20742,
      pms_default: 0,
      icd_code: "",
      tds_name: "Ddd",
      count: 3,
    },
    {
      objectID: "ed96bcd9-fe62-43ff-930f-4a833b628102",
      tds_id: 20735,
      pms_default: 0,
      icd_code: "",
      tds_name: "test3",
      count: 3,
    },
    {
      objectID: "2d149aa9-3d73-497c-8494-6648235b0e10",
      tds_id: 20761,
      pms_default: 0,
      icd_code: "",
      tds_name: "typhy",
      count: 2,
    },
    {
      objectID: "bcf6916a-fa81-4d92-a464-f3054f2bb5f2",
      tds_id: 20762,
      pms_default: 0,
      icd_code: "",
      tds_name: "deng",
      count: 1,
    },
    {
      objectID: "65e76191-9ef6-4896-bb7b-2184842ec5c8",
      tds_id: 20738,
      pms_default: 0,
      icd_code: "",
      tds_name: "Ddd",
      count: 1,
    },
    {
      objectID: "dbb8db8c-f65a-41d6-8876-0c5aa3fe1423",
      tds_id: 18196,
      pms_default: 1,
      icd_code: "",
      tds_name: "Wilson-Mikity syndrome",
      count: 1,
    },
    {
      objectID: "837e9504-fb88-4d19-a1bc-d854da3b96f9",
      tds_id: 20734,
      pms_default: 0,
      icd_code: "",
      tds_name: "test2",
    },
    {
      objectID: "959be805-7391-49bb-933a-c6c9e2f8967d",
      tds_id: 20733,
      pms_default: 0,
      icd_code: "",
      tds_name: "test",
    },
  ];

  // Simulate network delay
  await new Promise((r) => setTimeout(r, 250));

  if (!query) return MOCK; // Return all mocks when no query
  const q = query.toLowerCase();
  return MOCK.filter((x) => x.tds_name.toLowerCase().includes(q));
}
