import React from "react";
import DashboardCard01 from "../dashboardCards/DashboardCard01";
import { DollarSign, MessageSquare, ShoppingCart, Users, Activity, Bell } from "lucide-react";
import AreaChart01 from "../reCharts/AreaCharts/AreaChart01";
import BarChart08 from "../reCharts/BarCharts/BarChart08";
import { ColorTheme } from "../dashboardCards/DashboardCard01";
import BarChart01 from "../reCharts/BarCharts/BarChart01";
import PieChart11 from "../reCharts/PieCharts/PieChart11";
const dashboardCards = [
  {
    id: 1,
    icon: MessageSquare,
    title: "Messages",
    value: 100,
    description: "Since last month",
    trend: { value: 3.46, isPositive: true },
    colorTheme: "purple",
  },
  {
    id: 2,
    icon: Users,
    title: "Users",
    value: 245,
    description: "Since last month",
    trend: { value: 1.25, isPositive: true },
    colorTheme: "blue",
  },
   
 
  {
    id: 5,
    icon: Activity,
    title: "Activity",
    value: 89,
    description: "Since last month",
    trend: { value: 0.8, isPositive: true },
    colorTheme: "orange",
  },
  {
    id: 6,
    icon: Bell,
    title: "Alerts",
    value: 12,
    description: "Since last month",
    trend: { value: 1.4, isPositive: false },
    colorTheme: "red",
  },
]

const DashboardLayout = () => {
  return (
    <div className=" border p-4 gap-10 rounded-xl flex flex-col justify-between  bg-white">
      <div className="grid grid-cols-4 gap-4">
        {dashboardCards.map((card) => (
          <DashboardCard01
            key={card.id}
            icon={card.icon}
            title={card.title}
            value={card.value}
            description={card.description}
            trend={card.trend}
            colorTheme={card.colorTheme as ColorTheme}
          />
        ))}
      </div>

      <div className="grid grid-cols-5 gap-10">
        <div className="col-span-3  ">
          <AreaChart01 />
        </div>
        <div className="col-span-2  ">
          <BarChart08 />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-10">
      <div className="col-span-3  ">
      <BarChart01 />
        </div>
        <div className="col-span-2  ">
          <PieChart11 />
        </div>

      </div> 
    </div>
  );
};

export default DashboardLayout;
