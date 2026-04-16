import { Children, useContext } from "react";
import MenuBar from "./MenuBar";
import { AppContext } from "../context/AppContext";
import Sidebar from "./Sidebar";

const Dashboard = ({children, activeMenu}) => {

  const { user } = useContext(AppContext);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <MenuBar activeMenu={activeMenu} />
      
      {user ? (
        <div className="flex animate-fadeIn">
          <div className="max-[1080px]:hidden">
            <Sidebar activeMenu={activeMenu} />
          </div>

          <div className="flex-1 mx-6 my-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
            {/* Main Content Area */}
            <div className="h-full max-h-screen overflow-y-auto pr-2 custom-scrollbar">
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
           <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full shadow-lg"></div>
              <p className="text-purple-600 font-bold animate-bounce">Authenticating...</p>
           </div>
        </div>
      )}
 
    </div>
  );
};

export default Dashboard;