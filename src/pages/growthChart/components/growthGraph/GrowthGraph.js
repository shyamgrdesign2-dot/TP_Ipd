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
import minimise from "../../../../assets/images/minimise.svg";
import maximise from "../../../../assets/images/maximise.svg";
import "./GrowthGraph.scss";
import TooltipContent from "./TooltipContent";

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
  id: "customFillPlugin",
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const xAxis = chart.scales["x"];
    const yAxis = chart.scales["y"];
    const p7Dataset = chart.data.datasets.find(
      (dataset) => dataset.label === "P 7"
    );

    if (!p7Dataset || !p7Dataset.data.length) return;

    ctx.save();

    // Draw the main line chart path to use for clipping later
    ctx.beginPath();
    p7Dataset.data.forEach((point, index) => {
      const x = xAxis.getPixelForValue(point.x);
      const y = yAxis.getPixelForValue(point.y);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(
      xAxis.getPixelForValue(p7Dataset.data[p7Dataset.data.length - 1].x),
      yAxis.bottom
    );
    ctx.lineTo(xAxis.getPixelForValue(p7Dataset.data[0].x), yAxis.bottom);
    ctx.closePath();

    // Create gradient for green shadow
    const greenGradient = ctx.createLinearGradient(
      0,
      yAxis.top,
      0,
      yAxis.bottom + 100 // Extend gradient further down
    );
    greenGradient.addColorStop(0, "rgba(100, 230, 100, 0.3)");
    greenGradient.addColorStop(0.2, "rgba(100, 230, 100, 0.2)");
    greenGradient.addColorStop(0.4, "rgba(100, 230, 100, 0.1)");
    greenGradient.addColorStop(1, "rgba(37, 205, 37, 0)"); // Fully transparent at the bottom

    // Fill the area below the line chart with green gradient
    ctx.fillStyle = greenGradient;
    ctx.fill();

    // Now handle red shadows for each red point
    p7Dataset.data.forEach((point) => {
      if (point.isMalnutrition) {
        const x = xAxis.getPixelForValue(point.x);
        const y = yAxis.getPixelForValue(point.y);
        const shadowHeight = 30; // Height to extend shadow to x-axis
        const shadowWidth = 30; // Adjust shadow width to 30 pixels

        // Create gradient for red shadow
        const redGradient = ctx.createLinearGradient(0, y, 0, y + shadowHeight);
        redGradient.addColorStop(0, "rgba(255, 0, 0, 0.2)"); // Intense red at the point
        redGradient.addColorStop(1, "rgba(255, 0, 0, 0)"); // Fully transparent at the bottom

        // Clip to draw only below the point
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x - shadowWidth / 2, y);
        ctx.lineTo(x + shadowWidth / 2, y);
        ctx.lineTo(x + shadowWidth / 2, y + shadowHeight);
        ctx.lineTo(x - shadowWidth / 2, y + shadowHeight);
        ctx.closePath();
        ctx.clip();

        // Fill with gradient red color for shadow, limited to 30px below the point
        ctx.fillStyle = redGradient;
        ctx.fillRect(x - shadowWidth / 2, y, shadowWidth, shadowHeight);

        ctx.restore(); // Restore initial context state
      }
    });

    ctx.restore(); // Restore initial context state
  },
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
  data,
  isFullscreen,
  setIsFullscreen,
  handleDrawerVital,
  graphName,
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
  const tooltipRef = useRef(null);

  const [tooltipState, setTooltipState] = useState({
    visible: false,
    x: 0,
    y: 0,
    titleLines: [],
    bodyLines: [],
  });

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

  const handleTooltipClickOutside = (event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      handleCloseTooltip();
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
    if (tooltipState) {
      document.addEventListener("mousedown", handleTooltipClickOutside);
    } else {
      document.removeEventListener("mousedown", handleTooltipClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleTooltipClickOutside);
    };
  }, [tooltipState]);

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
        external: (context) => {
          const { chart, tooltip } = context;
          if (tooltip.opacity === 0) {
            return;
          }

          // Check if the tooltip should be displayed for this point
          if (
            tooltip.dataPoints.length &&
            chart.data.datasets[tooltip.dataPoints[0].datasetIndex].label ===
              "P 7"
          ) {
            const titleLines = tooltip.title || [];
            const bodyLines = tooltip.body.map((b) => b.lines);

            const { offsetLeft: positionX, offsetTop: positionY } =
              chart.canvas;

            setTooltipState({
              visible: true,
              x: positionX + tooltip.caretX,
              y: positionY + tooltip.caretY,
              titleLines,
              bodyLines,
            });
          } else {
            handleCloseTooltip();
          }
        },
      },
    },
    layout: {
      padding: {
        right: 30, // Add padding to the right side
      },
    },
  };

  const handleCloseTooltip = () => {
    setTooltipState({
      visible: false,
      x: 0,
      y: 0,
      titleLines: [],
      bodyLines: [],
    });
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
        <h5 style={{ margin: 0 }}>{graphName}</h5>
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
        {tooltipState.visible && (
          <div
            ref={tooltipRef}
            className="tooltipContainer"
            style={{ left: tooltipState.x - 98, top: tooltipState.y - 168 }}
          >
            <TooltipContent
              handleDrawerVital={handleDrawerVital}
              handleCloseTooltip={handleCloseTooltip}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightChart;
