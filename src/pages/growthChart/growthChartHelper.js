import moment from "moment";

export const dummyData = {
  labels: Array.from({ length: 24 }, (_, i) => i + 1), // Age in months from 1 to 24
  datasets: [
    {
      label: "P 3",
      data: [
        8.0, 8.5, 9.2, 9.9, 10.8, 11.6, 12.4, 13.0, 13.5, 13.9, 14.2, 14.5,
        14.8, 15.0, 15.2, 15.3, 15.5, 15.6, 15.7, 15.8, 15.9, 16.0, 16.1, 16.2,
      ],
      borderColor: "rgba(240, 69, 69, 0.2)",
      backgroundColor: "rgba(240, 69, 69, 1)",
      fill: true,
      pointRadius: 0, // Remove points
      pointHoverRadius: 0, // Remove points on hover
      hidden: false,
    },
    {
      label: "P 10",
      data: [
        9.5, 10.0, 10.7, 11.4, 12.3, 13.1, 13.9, 14.5, 15.0, 15.4, 15.7, 16.0,
        16.3, 16.5, 16.7, 16.8, 17.0, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7,
      ],
      borderColor: "rgba(75, 74, 213, 0.2)",
      backgroundColor: "rgba(75, 74, 213, 1)",
      fill: true,
      pointRadius: 0, // Remove points
      pointHoverRadius: 0, // Remove points on hover
      hidden: false,
    },
    {
      label: "P 50",
      data: [
        11.0, 11.5, 12.2, 12.9, 13.8, 14.6, 15.4, 16.0, 16.5, 16.9, 17.2, 17.5,
        17.8, 18.0, 18.2, 18.3, 18.5, 18.6, 18.7, 18.8, 18.9, 19.0, 19.1, 19.2,
      ],
      borderColor: "rgba(25, 187, 122, 0.2)",
      backgroundColor: "rgba(25, 187, 122, 1)",
      fill: true,
      pointRadius: 0, // Remove points
      pointHoverRadius: 0, // Remove points on hover
      hidden: false,
    },
    {
      label: "P 90",
      data: [
        13.0, 13.5, 14.2, 14.9, 15.8, 16.6, 17.4, 18.0, 18.5, 18.9, 19.2, 19.5,
        19.8, 20.0, 20.2, 20.3, 20.5, 20.6, 20.7, 20.8, 20.9, 21.0, 21.1, 21.2,
      ],
      borderColor: "rgba(186, 125, 233, 0.2)",
      backgroundColor: "rgba(164, 97, 216, 1)",
      fill: true,
      pointRadius: 0, // Remove points
      pointHoverRadius: 0, // Remove points on hover
      hidden: false,
    },
    {
      label: "P 97",
      data: [
        15.0, 15.5, 16.2, 16.9, 17.8, 18.6, 19.4, 20.0, 20.5, 20.9, 21.2, 21.5,
        21.8, 22.0, 22.2, 22.3, 22.5, 22.6, 22.7, 22.8, 22.9, 23.0, 23.1, 23.2,
      ],
      borderColor: "rgba(237, 138, 0, 0.2)",
      backgroundColor: "rgba(237, 138, 0, 1)",
      fill: true,
      pointRadius: 0, // Remove points
      pointHoverRadius: 0, // Remove points on hover
      hidden: false,
    },
    {
      label: "",
      data: [
        { x: 1, y: 10, isMalnutrition: false },
        { x: 6, y: 12, isMalnutrition: false },
        { x: 12, y: 18, isMalnutrition: false },
        { x: 18, y: 20, isMalnutrition: false },
        // { x: 18, y: 24, isMalnutrition: true },
        // { x: 24, y: 30, isMalnutrition: false },
      ],
      borderColor: [
        "#19BB7A", // Point 1
        "#19BB7A", // Point 2
        "#19BB7A", // Point 3
        "#19BB7A",
        // "#FF0000", // Point 4 (where the drop happens)
        "#19BB7A", // Point 5
      ],
      backgroundColor: [
        "#19BB7A", // Point 1
        "#19BB7A", // Point 2
        "#19BB7A", // Point 3
        "#19BB7A",
        // "#FF0000", // Point 4 (where the drop happens)
        "#19BB7A", // Point 5
      ],
      borderDash: [5, 5], // Make the line dotted
      pointRadius: 5, // Show points
      pointHoverRadius: 7, // Show points on hover
      hidden: false,
    },
  ],
};

export const getGrowthChartData = (growthChartData, patientDOB) => {
  return growthChartData.reduce(
    (acc, entry, index) => {
      const createdDate = moment(entry.tcbc_created_date);
      const DOB = moment(patientDOB, "Do MMM YYYY");
      const monthsDiff = createdDate.diff(DOB, "months");

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
      });
      acc.Weight.push({
        x: monthsDiff,
        y: entry.weight,
        isMalnutrition: isWeightMalnutrition,
      });
      acc.BMI.push({
        x: monthsDiff,
        y: entry.bmi,
        isMalnutrition: isBmiMalnutrition,
      });
      acc.OFC.push({
        x: monthsDiff,
        y: entry.ofc,
        isMalnutrition: isOfcMalnutrition,
      });

      return acc;
    },
    {
      Height: [],
      Weight: [],
      BMI: [],
      OFC: [],
    }
  );
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

  // Difference in days after subtracting the weeks
  const diffInDays = createdDate.diff(tempDate, "days");

  if (diffInYears) {
    return `${diffInYears} Year ${diffInMonths} Month`;
  } else if (diffInMonths) {
    return `${diffInMonths} Month ${diffInWeeks} Week`;
  } else {
    return `${diffInWeeks} Week ${diffInDays} Day`;
  }
};
