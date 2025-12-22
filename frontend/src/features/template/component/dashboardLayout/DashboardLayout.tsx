import AreaChart01 from "../reCharts/AreaCharts/AreaChart01";
import BarChart08 from "../reCharts/BarCharts/BarChart08";
import BarChart01 from "../reCharts/BarCharts/BarChart01";
import PieChart11 from "../reCharts/PieCharts/PieChart11";
 

const DashboardLayout = () => {
  return (
    <div className=" border p-4 gap-10 rounded-xl flex flex-col justify-between  bg-white">
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
