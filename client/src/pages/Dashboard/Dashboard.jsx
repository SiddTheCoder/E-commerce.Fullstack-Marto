import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, Sun } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { setUser } from "../../features/user/userSlice";

import StatsGrid from "./StatsGrid";
import SummaryChart from "./SummaryChart";
import MostSellingProducts from "./MostSellingProducts";
import RecentOrders from "./RecentOrders";
import TopCustomers from "./TopCustomers";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

// 📦 Dummy Data
const statsData = [
  {
    title: "Ecommerce Revenue",
    value: 245450, // number for count animation
    displayValue: "245,450", // formatted string for showing if you want
    change: "+14.9%",
    sub: "(+43.21%)",
    color: "text-green-600",
    bg: "bg-orange-50",
  },
  {
    title: "New Customers",
    value: 684,
    displayValue: "684",
    change: "-8.6%",
    sub: "",
    color: "text-red-500",
    bg: "bg-green-50",
  },
  {
    title: "Repeat Purchase Rate",
    value: 75.12,
    displayValue: "75.12 %",
    change: "+25.4 %",
    sub: "(+20.11 %)",
    color: "text-green-600",
    bg: "bg-indigo-50",
  },
  {
    title: "Average Order Value",
    value: 2412.23,
    displayValue: "$2,412.23",
    change: "+35.2 %",
    sub: "(+$575)",
    color: "text-green-600",
    bg: "bg-blue-50",
  },
  {
    title: "Conversion rate",
    value: 32.65,
    displayValue: "32.65 %",
    change: "-12.42 %",
    sub: "",
    color: "text-red-500",
    bg: "bg-red-50",
  },
];

const chartData = {
  labels: [
    "Sep 07",
    "Sep 08",
    "Sep 09",
    "Sep 10",
    "Sep 11",
    "Sep 12",
    "Sep 13",
  ],
  datasets: [
    {
      label: "Order",
      data: [5000, 7500, 7200, 4300, 3000, 3800, 6000],
      borderColor: "#22C55E",
      backgroundColor: "#22C55E",
      tension: 0.3,
    },
    {
      label: "Income Growth",
      data: [6000, 7000, 6900, 5500, 4000, 4500, 7000],
      borderColor: "#3B82F6",
      backgroundColor: "#3B82F6",
      tension: 0.3,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const products = [
  { name: "Snicker Vento", id: "2441310", sales: "128 Sales", image: "👟" },
  { name: "Blue Backpack", id: "1241318", sales: "401 Sales", image: "🎒" },
  { name: "Water Bottle", id: "8441573", sales: "1K+ Sales", image: "🚰" },
];


const topCustomers = [
  { name: "Marks Hoverson", orders: 25 },
  { name: "Marks Hoverson", orders: 15 },
  { name: "Jhony Peters", orders: 23 },
];


export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);


  useEffect(() => {
    if (!user || user.role !== "seller") {
      toast.error("Become a seller to access dashboard");
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (orders?.lenght <= 0) {
      toast.success("We use dummy data until you get your first order");
    }
    const verifyDashvoardVisit = async () => {
      try {
        const response = await axiosInstance.post(
          "/user/verify-visit-to-seller-dashboard"
        );
        dispatch(setUser(response.data.user));
      } catch (error) {
        console.log(error);
      }
    };
    verifyDashvoardVisit();
  }, []);

  return (
    <div className="flex-1 bg-[#e4e7eb] p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-200 bg-white shadow-sm outline-none text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-4">
          <Sun className="text-gray-500 h-5 w-5 cursor-pointer" />
          <img src={user?.avatar} className="rounded-full h-8 w-8" alt="user" />
        </div>
      </div>

      {/* Greeting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome Back,{" "}
            <span className="highlight-tilt p-[1.5px] text-white">
              {user?.fullName}
            </span>
          </h1>
          <p className="text-sm text-gray-500">
            Here's what happening with your store today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white shadow-sm">
            <option>Previous Year</option>
            <option>This Year</option>
          </select>
          <button className="text-sm font-medium px-4 py-2 bg-gray-900 text-white rounded-md">
            View All Time
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsGrid stats={statsData} />

      {/* Charts and Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <SummaryChart chartData={chartData} chartOptions={chartOptions} />
        <MostSellingProducts products={products} />
      </div>

      {/* Orders and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentOrders />
        <TopCustomers topCustomers={topCustomers} />
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}