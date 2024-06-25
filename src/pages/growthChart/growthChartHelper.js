import moment from "moment";

export const dummyData = {
  datasets: [
    {
      key: "P3",
      label: "P 03",
      borderColor: "rgba(240, 69, 69, 0.3)",
      backgroundColor: "rgba(240, 69, 69, 1)",
      fill: true,
      pointRadius: 0, // Remove points
      pointHoverRadius: 0, // Remove points on hover
      hidden: false,
    },
    {
      key: "P10",
      label: "P 10",
      borderColor: "rgba(75, 74, 213, 0.3)",
      backgroundColor: "rgba(75, 74, 213, 1)",
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 0,
      hidden: false,
    },
    {
      key: "P50",
      label: "P 50",
      borderColor: "rgba(25, 187, 122, 0.3)",
      backgroundColor: "rgba(25, 187, 122, 1)",
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 0,
      hidden: false,
    },
    {
      key: "P90",
      label: "P 90",
      borderColor: "rgba(186, 125, 233, 0.3)",
      backgroundColor: "rgba(164, 97, 216, 1)",
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 0,
      hidden: false,
    },
    {
      key: "P97",
      label: "P 97",
      borderColor: "rgba(237, 138, 0, 0.3)",
      backgroundColor: "rgba(237, 138, 0, 1)",
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 0,
      hidden: false,
    },
  ],
};

export const getGrowthChartData = (growthChartData, patientDOB, ageInYears) => {
  return growthChartData.reduce(
    (acc, entry, index) => {
      const createdDate = moment(entry.tcbc_created_date);
      const DOB = moment(patientDOB, "Do MMM YYYY");
      const monthsDiff = createdDate.diff(DOB, "months");
      const yearsDiff = createdDate.diff(DOB, "years");

      if (ageInYears > 5) {
        if (yearsDiff <= 5) {
          return acc;
        }
      } else if (ageInYears > 2) {
        if (yearsDiff <= 2) {
          return acc;
        }
      }

      let isHeightMalnutrition = false;
      let isWeightMalnutrition = false;
      let isBmiMalnutrition = false;
      let isOfcMalnutrition = false;

      if (index > 0) {
        // Check for height malnutrition
        if (entry.height > growthChartData[index - 1].height) {
          isHeightMalnutrition = true;
        }

        // Check for weight malnutrition
        if (entry.weight > growthChartData[index - 1].weight) {
          isWeightMalnutrition = true;
        }

        // Check for BMI malnutrition
        if (entry.bmi > growthChartData[index - 1].bmi) {
          isBmiMalnutrition = true;
        }

        // Check for OFC malnutrition
        if (entry.ofc > growthChartData[index - 1].ofc) {
          isOfcMalnutrition = true;
        }
      }

      acc.Height.push({
        x: monthsDiff,
        y: entry.height,
        isMalnutrition: isHeightMalnutrition,
        data: entry,
      });
      acc.Weight.push({
        x: monthsDiff,
        y: entry.weight,
        isMalnutrition: isWeightMalnutrition,
        data: entry,
      });
      acc.BMI.push({
        x: monthsDiff,
        y: entry.bmi,
        isMalnutrition: isBmiMalnutrition,
        data: entry,
      });
      acc.OFC.push({
        x: monthsDiff,
        y: entry.ofc,
        isMalnutrition: isOfcMalnutrition,
        data: entry,
      });
      acc.HeightVsWeight.push({
        x: entry.height,
        y: entry.weight,
        isMalnutrition: isWeightMalnutrition,
        data: entry,
      });

      return acc;
    },
    {
      Height: [],
      Weight: [],
      BMI: [],
      OFC: [],
      HeightVsWeight: [],
    }
  );
};

const getOrdinalSuffix = (n) => {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const getAge = (tcbcCreatedDate, patientDOB) => {
  const createdDate = moment(tcbcCreatedDate);
  const DOB = moment(patientDOB, "Do MMM YYYY");

  // Difference in years
  const diffInYears = createdDate.diff(DOB, "years");
  const tempDate = DOB.clone().add(diffInYears, "years");

  // Difference in months after subtracting the years
  const diffInMonths = createdDate.diff(tempDate, "months");
  tempDate.add(diffInMonths, "months");

  // Difference in weeks after subtracting the months
  const diffInWeeks = createdDate.diff(tempDate, "weeks");
  tempDate.add(diffInWeeks, "weeks");

  if (diffInYears) {
    return `${getOrdinalSuffix(diffInYears)} Year`;
  } else if (diffInMonths) {
    return `${getOrdinalSuffix(diffInMonths)} Month`;
  } else {
    return `${getOrdinalSuffix(diffInWeeks)} Week`;
  }
};

export const getMidParentalHeight = (fatherHeight, motherHeight) => {
  const maleChildHeight = (fatherHeight + motherHeight + 13) / 2;
  const femaleChildHeight = (fatherHeight + motherHeight - 13) / 2;

  return {
    maleChildHeight,
    femaleChildHeight,
  };
};
export const graphsToPrintData = [
  {
    label: "Height",
    isPrintEnabled: true,
  },
  {
    label: "Weight",
    isPrintEnabled: true,
  },
  {
    label: "BMI",
    isPrintEnabled: true,
  },
  {
    label: "OFC",
    isPrintEnabled: true,
  },
  {
    label: "Height Vs Weight",
    isPrintEnabled: true,
  },
];

export const UNITS = {
  Height: "cm",
  Weight: "kg",
  BMI: "kg/m2",
  OFC: "cm",
};

export const ageIntervals = {
  "0To2": 2,
  "2To5": 4,
  "5To18": 6,
}

export const getAgeInMonths = (patientDOB) => {
  const today = moment(new Date());
  const DOB = moment(patientDOB, "Do MMM YYYY");

  return today.diff(DOB, "months");
};
