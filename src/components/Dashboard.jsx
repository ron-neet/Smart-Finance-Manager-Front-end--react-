import { Children, useContext } from "react";
import MenuBar from "./MenuBar";
import { AppContext } from "../context/AppContext";
import Sidebar from "./Sidebar";

const Dashboard = ({children, activeMenu}) => {

  const { user } = useContext(AppContext);
  
  return (
    <div>
      <MenuBar activeMenu={activeMenu} />

     {user && (
      
        <div className="flex mt-6">
          <div className="max-[1080px]:hidden">
            <Sidebar activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5 bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl border border-gray-100">
            {/* Main Content Area */}
            {children}
          </div>
        </div>)}
 
    </div>
  );
};

export default Dashboard; 