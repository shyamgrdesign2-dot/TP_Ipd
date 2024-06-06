import React, { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Button, Modal, Checkbox } from "antd";
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
import { dummyData } from "../subHeader/SubHeader";

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
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Age (months)", // X-axis label
        },
      },
      y: {
        title: {
          display: true,
          text: "Weight (kg)", // Y-axis label
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
    layout: {
      padding: {
        right: 25, // Add padding to the right side
      },
    },
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
    <div
      style={{
        position: "relative",
        height: "250px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px 10px 35px 10px",
      }}
    >
      <div
        style={{
          padding: "20px",
          height: "100%",
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
          <h5 style={{ margin: 0 }}>Weight</h5>
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
        <div style={{ position: "relative", height: "100%", width: "100%" }}>
          <Line ref={chartRef} data={chartData} options={options} />
        </div>
      </div>
      <Modal
        title="Toggle Line Visibility"
        visible={modalIsOpen}
        onCancel={() => setModalIsOpen(false)}
        footer={[
          <Button key="close" onClick={() => setModalIsOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {data.datasets.map((dataset, index) => (
          <Checkbox
            key={index}
            checked={visibility[index]}
            onChange={() => toggleVisibility(index)}
          >
            {dataset.label}
          </Checkbox>
        ))}
      </Modal>
    </div>
  );
};

export default WeightChart;
