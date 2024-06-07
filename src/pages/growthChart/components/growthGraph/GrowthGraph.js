import React, { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Button, Checkbox } from "antd";
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
import minimise from "../../../../assets/images/minimise.svg";
import maximise from "../../../../assets/images/maximise.svg";
import closeFill from "../../../../assets/images/closeFill.svg";
import "./GrowthGraph.scss";

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

const WeightChart = ({
  data = dummyData,
  isFullscreen,
  setIsFullscreen,
  handleDrawerVital,
}) => {
  const chartRef = useRef(null);
  const [shouldShowPercentilePopup, setPercentilePopup] = useState(false);
  const [visibility, setVisibility] = useState(
    data.datasets.map((ds) => !ds.hidden)
  );

  const [popup, setPopup] = useState({
    visible: false,
    x: 0,
    y: 0,
    coords: {},
  });
  const popupRef = useRef(null);

  const handleButtonClick = () => {
    setPercentilePopup((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      !chartRef.current?.canvas?.contains(event.target)
    ) {
      setPercentilePopup(false);
      setPopup({ visible: false, x: 0, y: 0, coords: {} });
    }
  };

  const handleChartClick = (event) => {
    const points = chartRef.current?.getElementsAtEventForMode(
      event,
      "nearest",
      { intersect: true },
      true
    );

    if (points.length) {
      const firstPoint = points[0];
      const { x, y } = firstPoint.element;
      const datasetIndex = firstPoint.datasetIndex;
      const index = firstPoint.index;
      const dataX = data.datasets[datasetIndex].data[index].x;
      const dataY = data.datasets[datasetIndex].data[index].y;

      setPopup({
        visible: true,
        x: event.native.offsetX,
        y: event.native.offsetY,
        coords: { dataX, dataY },
      });
    } else {
      setPopup({ visible: false, x: 0, y: 0, coords: {} });
    }
  };

  useEffect(() => {
    if (shouldShowPercentilePopup || popup.visible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shouldShowPercentilePopup, popup.visible]);

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
    onClick: handleChartClick,
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
    <div style={{ height: "100%" }}>
      <div className="graphHeader">
        <h5 style={{ margin: 0 }}>Weight</h5>
        <div>
          <div style={{ display: "flex" }}>
            <button
              type="link"
              className="percentileBtn"
              onClick={() => setPercentilePopup(true)}
            >
              Percentile
              <i className="icon-right iconStyle" />
            </button>
            <img
              onClick={toggleFullscreen}
              className="me-3"
              style={{ cursor: "pointer" }}
              src={isFullscreen ? minimise : maximise}
              alt="Warning"
            />
          </div>
          {shouldShowPercentilePopup && (
            <div ref={popupRef} className="enablePercentile">
              <div className="percentileText">
                Enable/Disable percentile line
              </div>
              <div className="percentileContainer">
                <div>
                  {data.datasets.map((dataset, index) => (
                    <>
                      <Checkbox
                        key={index}
                        style={{ padding: "6px" }}
                        checked={visibility[index]}
                        onChange={() => toggleVisibility(index)}
                      >
                        {dataset.label}
                      </Checkbox>

                      {index !== data.datasets.length - 1 && index !== 2 && (
                        <span className="breakStyle" />
                      )}
                    </>
                  ))}
                </div>
                <Button
                  type="button"
                  className="btn ant-btn-text btn-input doneBtn"
                  onClick={handleButtonClick}
                >
                  <span className="doneText">Done</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <Line ref={chartRef} data={chartData} options={options} />
        {popup.visible && (
          <div
            className="tooltipStyle"
            style={{
              left: popup.x,
              top: popup.y,
            }}
          >
            <div className="measurementContainer">
              <div className="measurementText">
                Measurements
                <i
                  className="icon-Edit iconStyle"
                  onClick={handleDrawerVital}
                />
              </div>
              <img
                src={closeFill}
                alt="close"
                className="closeImg"
                onClick={() =>
                  setPopup({ visible: false, x: 0, y: 0, coords: {} })
                }
              />
            </div>
            <div className="measurementContainer">
              <div>Age: 3 months</div>
              <div>Updated: 06 Jun 2024</div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                Height : 40 cms <span className="breakStyle" /> Weight : 08 kg
              </div>
              <div>
                BMI : 13 kg/m2 <span className="breakStyle" /> OFC : 13 kg/m2
              </div>
              {/* X: {popup.coords.dataX}, Y: {popup.coords.dataY} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightChart;
