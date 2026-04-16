import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // make sure you have react-hot-toast installed

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Category from "./pages/Category";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Home from "./pages/Home";
import Filter from "./pages/Filter";
import Forecast from "./pages/Forecast";
import Planning from "./pages/Planning";
import Budget from "./pages/Budget";
import Recurring from "./pages/Recurring";
// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
// Admin Layout
import AdminLayout from "./components/AdminLayout";
import Landing from "./pages/Landing";

const App = () => {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/category" element={<Category />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/recurring" element={<Recurring />} />
          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;