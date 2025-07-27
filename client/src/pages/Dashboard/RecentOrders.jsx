import React from "react";

const RecentOrders = ({ orders }) => {
  return (
    <div className="lg:col-span-2 bg-white/90 backdrop-blur-[3px] p-5 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
        <button className="text-sm text-blue-600">View All</button>
      </div>
      <table className="w-full text-sm">
        <thead className="text-gray-500 text-left border-b">
          <tr>
            <th className="py-2">Product</th>
            <th>Customer</th>
            <th>Order ID</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="py-3">{order.product}</td>
              <td>{order.customer}</td>
              <td>{order.orderId}</td>
              <td>{order.date}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
