
export async function fetchDiagnosesAPI(query) {
    const MOCK = [
      { id: "d1", title: "Chronic Migraine", icdCode: "192.78" },
      { id: "d2", title: "Acute Migraine", icdCode: "192.70" },
      { id: "d3", title: "Tension-Type Headache", icdCode: "G44.2" },
      { id: "d4", title: "Cluster Headache", icdCode: "G44.0" },
      { id: "d5", title: "Migraine with Aura", icdCode: "G43.1" },
      { id: "d6", title: "Sinus Headache", icdCode: "J01.90" },
      { id: "d7", title: "Cervicogenic Headache", icdCode: "M54.2" },
      { id: "d8", title: "Medication-Overuse Headache", icdCode: "G44.40" },
      { id: "d9", title: "Hemiplegic Migraine", icdCode: "G43.4" },
      { id: "d10", title: "Abdominal Migraine", icdCode: "G43.D" },
    ];
  
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 250));
  
    if (!query) return MOCK; // Return all mocks when no query
    const q = query.toLowerCase();
    return MOCK.filter((x) => x.title.toLowerCase().includes(q));
  }
  