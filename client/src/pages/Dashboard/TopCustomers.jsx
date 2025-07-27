import React from "react";
import { MoreVertical } from "lucide-react";

const TopCustomers = ({ topCustomers }) => {
  return (
    <div className="bg-white/60 backdrop-blur-[3px] p-5 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Weekly Top Customers</h3>
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </div>
      <ul className="space-y-4">
        {topCustomers.map((c, i) => (
          <li key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src={`https://i.pravatar.cc/40?img=${i + 5}`}
                className="w-8 h-8 rounded-full"
                alt={c.name}
              />
              <div>
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-gray-400">{c.orders} Orders</div>
              </div>
            </div>
            <button className="text-xs text-blue-600 font-medium">View</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopCustomers;
