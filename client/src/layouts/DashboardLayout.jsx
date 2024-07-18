// src/layouts/DashboardLayout.js
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { Navigation } from "../components/navigation/Navigation";
import { useAppContext } from '../context/AppContext';

const DashboardLayout = () => {
  const location = useLocation();
  const { user } = useAppContext();

  let title = "Default Title";

  switch (location.pathname) {
    case "/dashboard":
      title = "Dashboard";
      break;
    case "/dashboard/profile":
      title = "Profile";
      break;
    case "/dashboard/createstaff":
      title = "Create Staff";
      break;
    case "/dashboard/store":
      title = "Stores";
      break;
    case "/dashboard/staffs":
      title = "Staffs";
      break;
    case "/dashboard/suppliers":
      title = "Suppliers";
      break;
    case "/dashboard/category":
      title = "Categories";
      break;
    case "/dashboard/product":
      title = "Products";
      break;
    case "/dashboard/batch":
      title = "Product Batch";
      break;
    default:
      break;
  }

  return (
    <div className="flex">
      <Sidebar role={user?.role} />
      <div className="layout-width absolute right-0">
        <Navigation title={title} />
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

