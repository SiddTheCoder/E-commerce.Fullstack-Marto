import React from "react";
import { MoreVertical } from "lucide-react";

const MostSellingProducts = ({ products }) => {
  return (
    <div className="bg-white/60 backdrop-blur-[3px] p-5 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Most Selling Products</h3>
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </div>
      <ul className="space-y-4">
        {products.map((p, i) => (
          <li key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{p.image}</span>
              <div>
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="text-xs text-gray-400">ID: {p.id}</div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700">{p.sales}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MostSellingProducts;
