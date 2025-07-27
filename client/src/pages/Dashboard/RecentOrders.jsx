import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardOrderedProducts } from "../../features/dashboard/dashboardThunks";
import { useNavigate } from "react-router-dom";

const dummyOrders = [
  {
    product: "Water Bottle",
    quantity : 24,
    customer: "Peterson Jack",
    orderId: "#8441573",
    date: "27 Jun 2025",
    status: "Pending",
    statusColor: "text-yellow-600 bg-yellow-100",
  },
  {
    product: "iPhone 15 Pro",
    quantity : 7,
    customer: "Michel Datta",
    orderId: "#2457841",
    date: "26 Jun 2025",
    status: "Canceled",
    statusColor: "text-red-600 bg-red-100",
  },
  {
    product: "Headphone",
    quantity : 13,
    customer: "Jeslya Rose",
    orderId: "#1024784",
    date: "20 Jun 2025",
    status: "Shipped",
    statusColor: "text-green-600 bg-green-100",
  },
];

const RecentOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dashboardOrderedProducts } = useSelector((state) => state.dashboard);

  const [expandedOrderIds, setExpandedOrderIds] = useState({});

  useEffect(() => {
    dispatch(getDashboardOrderedProducts());
  }, [dispatch]);

  const toggleExpand = (key) => {
    setExpandedOrderIds((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (dashboardOrderedProducts && dashboardOrderedProducts.length > 0) {
    return (
    <div className="lg:col-span-2 bg-white/90 backdrop-blur-[3px] p-5 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
        <button onClick={() => navigate("/orders")} className="text-sm text-blue-600 cursor-pointer hover:bg-blue-900 hover:text-white p-1 rounded transition ">View All</button>
      </div>
      <table className="w-full text-sm border-separate border-spacing-y-3">
        <thead className="text-gray-500 text-left border-b">
          <tr>
            <th className="py-2 px-3">Product</th>
            <th className="px-3">Quantity</th>
            <th className="px-3">Customer</th>
            <th className="px-3">Order ID</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 gap-y-2">
          {dashboardOrderedProducts.map((order, orderIndex) =>
            order.products.map((item, productIndex) => {
              const key = `${order.orderId}-${productIndex}`;
              const isExpanded = expandedOrderIds[key];

              return (
                <tr key={key} className="border-b hover:bg-gray-50">
                  <td
                    className={`px-3 font-semibold max-w-[100px] cursor-pointer ${
                      isExpanded ? "" : "truncate"
                    }`}
                    onClick={() => toggleExpand(key)}
                  >
                    {item.title}
                  </td>
                  <td className="px-3">{item.quantity}</td>
                  <td className="px-3">{order.customer}</td>
                  <td
                    className={`px-3 font-semibold max-w-[100px] cursor-pointer ${
                      isExpanded ? "" : "truncate"
                    }`}
                    onClick={() => toggleExpand(key)}
                    title={order.orderId}
                  >
                    {order.orderId}
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
  }
  else {
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
            <th className="py-2">Quantity</th>
            <th>Customer</th>
            <th>Order ID</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyOrders.map((order, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="py-3">{order.product}</td>
              <td>{order.quantity}</td>
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
  }
};

export default RecentOrders;
