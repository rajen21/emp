import { useState } from "react"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "../redirection/ProtectedRoute";
import { fetchUser, homeState } from "./homeSlice";
import { useEffect } from "react";
import { AppDispatch } from "../../store/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function Home() {
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(new Date());
  const dispatch: AppDispatch = useDispatch();
  const data = useSelector(homeState);

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<Date>>, date: string) => {
    setter(new Date(date));
  };

  const cardData = [
    { title: 'Users', count: 1500 },
    { title: 'Orders', count: 700 },
    { title: 'Revenue', count: '$25,000' },
    { title: 'Products', count: 120 },
  ];

  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [50, 100, 200, 150, 300, 250, 400],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['Electronics', 'Fashion', 'Grocery', 'Home & Kitchen', 'Books'],
    datasets: [
      {
        data: [300, 150, 200, 100, 50],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const lineData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Weekly Visitors',
        data: [500, 700, 800, 600, 750, 900, 1000],
        fill: false,
        borderColor: '#42A5F5',
      },
    ],
  };

  const filteredList = [
    { date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), description: 'Order #1234' },
    { date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), description: 'User Registration #567' },
    { date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), description: 'Revenue $1200' },
  ];

  useEffect(() => {
    dispatch(fetchUser());
  }, []);
  console.log(data);
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Card Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cardData.map((card, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-2xl font-bold mt-2">{card.count}</p>
          </div>
        ))}
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Monthly Sales (Bar Chart)</h3>
          <Bar data={barData} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Sales Distribution (Pie Chart)</h3>
          <Pie data={pieData} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Weekly Visitors (Line Chart)</h3>
          <Line data={lineData} />
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
        <div className="flex gap-4">
          <input
            type="date"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={(e) => handleDateChange(setStartDate, e.target.value)}
            className="border rounded-md p-2"
          />
          <input
            type="date"
            value={format(endDate, 'yyyy-MM-dd')}
            onChange={(e) => handleDateChange(setEndDate, e.target.value)}
            className="border rounded-md p-2"
          />
        </div>
      </div>

      {/* List with Date Filter */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
        <ul>
          {filteredList.map((item, index) => (
            <li key={index} className="border-b py-2">
              <span className="font-bold">{item.date}</span> - {item.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default { 
  path: "/", 
  element: <ProtectedRoute element={<Home />} />,
};