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

          <div className="grow mx-5 bg-white p-6 rounded-xl shadow-lg">
            {/* Main Content Area */}
            {children}
          </div>
        </div>)}
 
    </div>
  );
};

export default Dashboard; 