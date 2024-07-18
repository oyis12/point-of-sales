import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppState } from "./context/AppState";
import CompanySetup from "./pages/auth/CompanySetup";
import AdminSetup from "./pages/auth/AdminSetup";
import Login from "./pages/auth/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import Store from "./pages/dashboard/Store";
import Users from "./pages/dashboard/Users";
import Suppliers from "./pages/dashboard/Suppliers";
import Category from "./pages/dashboard/Category";
import Product from "./pages/dashboard/Product";
import Batch from "./pages/dashboard/Batch";
import CreateStaff from "./pages/dashboard/CreateStaff";
import UserLayout from "./pages/dashboard/UserLayout";
import Unauthorized from "./components/unauthorized/Unauthorized";
import Cashier from "./pages/cashier/Cashier";
import Pos from "./pages/cashier/Pos";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
<AppState>
        <Router>
          <Routes>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<Login />} />
            <Route path="/company-setup" element={<CompanySetup />} />
            <Route path="/admin-set-up" element={<AdminSetup />} />
           <Route element={<ProtectedRoute roles={['owner','productManager', 'storeManager', 'cashier']} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="store" element={<Store />} />
                <Route path="staffs" element={<UserLayout />}>
                  <Route path="" element={<Users />} />
                  <Route path="createstaff" element={<CreateStaff />} />
                </Route>
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="category" element={<Category />} />
                <Route path="product" element={<Product />} />
                <Route path="batch" element={<Batch />} />
            </Route>
           </Route>
            <Route path="/cashier" element={<ProtectedRoute roles={['cashier']} />}>
              <Route path="" element={<Cashier />}>
                <Route path="pos" element={<Pos />} />
                {/* <Route path="profile" element={<Profile />} /> */}
              </Route>
            </Route>
          </Routes>
        </Router>
      </AppState>
    </>
  );
}

export default App;

