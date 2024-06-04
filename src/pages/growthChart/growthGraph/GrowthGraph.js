import React, { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Modal, Button, Checkbox } from "antd";
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
import TogglePercentileLine from "../togglePercentileLine/TogglePercentileLine";

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

// Custom plugin to draw labels at the end of each line
const customLabelPlugin = {
  id: "customLabelPlugin",
  afterDatasetsDraw(chart) {
    const {
      ctx,
      chartArea: { right },
    } = chart;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      if (!chart.isDatasetVisible(datasetIndex)) return; // Check if the dataset is visible

      const meta = chart.getDatasetMeta(datasetIndex);
      const lastPoint = meta.data[meta.data.length - 1];

      if (!lastPoint) return;

      const { x, y: pointY } = lastPoint.tooltipPosition();
      const label = dataset.label;

      ctx.save();
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.font = "12px Arial";
      ctx.fillStyle = dataset.borderColor;
      ctx.fillText(label, right + 5, pointY);
      ctx.restore();
    });
  },
};

const dummyData = {
  labels: Array.from({ length: 24 }, (_, i) => i + 1), // Age in months from 1 to 24
  datasets: [
    {
      label: "P 2",
      data: [
        9.5, 10.0, 10.7, 11.4, 12.3, 13.1, 13.9, 14.5, 15.0, 15.4, 15.7, 16.0,
        16.3, 16.5, 16.7, 16.8, 17.0, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7,
      ],
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      fill: true,
      pointRadius: 0, // Remove points
      pointHoverRadius: 0, // Remove points on hover
      hidden: false,
    },
    {
      label: "P 3",
      data: [
        9.0, 9.5, 10.2, 10.9, 11.8, 12.6, 13.4, 14.0, 14.5, 14.9, 15.2, 15.5,
        15.8, 16.0, 16.2, 16.3, 16.5, 16.6, 16.7, 16.8, 16.9, 17.0, 17.1, 17.2,
      ],
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      fill: true,
      pointRadius: 0, // Remove points
      pointHoverRadius: 0, // Remove points on hover
      hidden: false,
    },
  ],
};

const WeightChart = ({ data = dummyData }) => {
  const chartRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [visibility, setVisibility] = useState(
    data.datasets.map((ds) => !ds.hidden)
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartWidth, setChartWidth] = useState("auto");

  useEffect(() => {
    if (chartRef.current) {
      // Register the plugin only once
      ChartJS.register(customLabelPlugin);
    }

    return () => {
      // Unregister the plugin when the component unmounts
      ChartJS.unregister(customLabelPlugin);
    };
  }, []);

  useEffect(() => {
    setChartWidth(isFullscreen ? "100vw" : "auto");
  }, [isFullscreen]);

  const toggleVisibility = (index) => {
    setVisibility((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return [...newVisibility]; // Return a new array to trigger re-render
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        ticks: {
          stepSize: 1, // Controls the spacing between intervals on the x-axis
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: true, // Fixed aspect ratio
  };

  // Update the dataset visibility based on the state
  data.datasets.forEach((dataset, index) => {
    dataset.hidden = !visibility[index]; // Update dataset visibility
  });

  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      hidden: !visibility[index],
    })),
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          padding: "20px",
          width: chartWidth,
          height: "auto",
          transition: "width 0.3s ease-in-out",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h2 style={{ margin: 0 }}>Weight</h2>
          <div>
          <Button
              type="primary"
              onClick={() => setModalIsOpen(true)}
              style={{ marginRight: "10px" }}
            >
              Toggle Lines
            </Button>
            <Button type="default" onClick={toggleFullscreen}>
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </div>
        </div>
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WeightChart;
