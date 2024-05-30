import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeightChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !chartRef.current.chartInstance) {
      return;
    }

    const chartInstance = chartRef.current.chartInstance;
    const container = chartRef.current.container;

    const renderLabels = () => {
      chartInstance.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chartInstance.getDatasetMeta(datasetIndex);
        const lastPoint = meta.data[meta.data.length - 1].getCenterPoint();
        const labelX = chartInstance.chartArea.right + 10; // Adjust this value to control the distance from the right side
        const labelY = lastPoint.y;

        const label = document.createElement("div");
        label.classList.add("chart-label");
        label.textContent = dataset.label;
        label.style.position = "absolute";
        label.style.left = `${labelX}px`;
        label.style.top = `${labelY}px`;

        container.appendChild(label);
      });
    };

    renderLabels();

    // Cleanup
    return () => {
      // Clear labels when the component is unmounted
      const labels = container.querySelectorAll(".chart-label");
      labels.forEach((label) => label.remove());
    };
  }, []);

  // Dummy data for the chart
  const data = {
    labels: Array.from({ length: 24 }, (_, i) => i + 1), // Age in months from 1 to 24
    datasets: [
      {
        label: "Person 1",
        data: [
          3.5, 4.0, 4.7, 5.5, 6.4, 7.3, 8.1, 8.9, 9.5, 10.0, 10.4, 10.7, 11.0,
          11.3, 11.5, 11.7, 11.8, 12.0, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6,
        ],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        pointRadius: 0, // Remove points
        pointHoverRadius: 0, // Remove points on hover
      },
      {
        label: "Person 2",
        data: [
          9.5, 10.0, 10.7, 11.4, 12.3, 13.1, 13.9, 14.5, 15.0, 15.4, 15.7, 16.0,
          16.3, 16.5, 16.7, 16.8, 17.0, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6,
          17.7,
        ],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        pointRadius: 0, // Remove points
        pointHoverRadius: 0, // Remove points on hover
      },
      {
        label: "Person 3",
        data: [
          7.5, 8.0, 8.7, 9.5, 10.4, 11.3, 12.1, 12.9, 13.5, 14.0, 14.4, 14.7,
          15.0, 15.3, 15.5, 15.7, 15.8, 16.0, 16.1, 16.2, 16.3, 16.4, 16.5,
          16.6,
        ],
        borderColor: "rgba(255, 205, 86, 1)",
        backgroundColor: "rgba(255, 205, 86, 0.2)",
        fill: true,
        pointRadius: 0, // Remove points
        pointHoverRadius: 0, // Remove points on hover
      },
      {
        label: "Person 4",
        data: [
          5.5, 6.0, 6.7, 7.5, 8.4, 9.3, 10.1, 10.9, 11.5, 12.0, 12.4, 12.7,
          13.0, 13.3, 13.5, 13.7, 13.8, 14.0, 14.1, 14.2, 14.3, 14.4, 14.5,
          14.6,
        ],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        pointRadius: 0, // Remove points
        pointHoverRadius: 0, // Remove points on hover
      },
      {
        label: "Person 5",
        data: [
          11.5, 12.0, 12.7, 13.5, 14.4, 15.3, 16.1, 16.9, 17.5, 18.0, 18.4,
          18.7, 19.0, 19.3, 19.5, 19.7, 19.8, 20.0, 20.1, 20.2, 20.3, 20.4,
          20.5, 20.6,
        ],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
        pointRadius: 0, // Remove points
        pointHoverRadius: 0, // Remove points on hover
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Weight Tracking by Age in Months",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Weight (kg)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Age (Months)",
        },
      },
    },
    elements: {
      line: {
        tension: 0.4, // Adjust the curve of the line
      },
    },
  };

  return (
    <div style={{ position: "relative" }}>
      <Line ref={chartRef} data={data} options={options} />
      <div ref={(chartRef) => chartRef && (chartRef.container = chartRef)} />
    </div>
  );
};

export default WeightChart;
