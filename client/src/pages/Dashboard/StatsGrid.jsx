import React from "react";
import CountUp from "react-countup";

const StatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`rounded-xl p-4 shadow-sm bg-white/90 backdrop-blur-[3px] ${item.bg}`}
          style={{
            animation: `fadeInUp 0.5s ease forwards`,
            animationDelay: `${index * 150}ms`,
            opacity: 0,
          }}
        >
          <h3 className="text-xs text-gray-500">{item.title}</h3>
          <p className="text-lg font-semibold text-gray-800">
            <CountUp
              start={Math.max(item.value - 30, 0)}
              end={item.value}
              duration={1.5}
              separator=","
              decimals={2}
              decimal="."
              prefix={item.title === "Average Order Value" ? "$" : ""}
              suffix={item.displayValue.includes("%") ? " %" : ""}
            />
          </p>
          <span className={`text-xs font-medium ${item.color}`}>
            {item.change} {item.sub}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
