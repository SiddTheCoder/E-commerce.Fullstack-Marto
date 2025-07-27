import React from "react";
import { Line } from "react-chartjs-2";

const SummaryChart = ({ chartData, chartOptions }) => {
  return (
    <div className="lg:col-span-2 bg-white/90 backdrop-blur-[3px] p-5 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Summary</h3>
        <span className="text-sm text-gray-500">Last 7 days</span>
      </div>
      <Line data={chartData} options={chartOptions} height={130} />
    </div>
  );
};

export default SummaryChart;
