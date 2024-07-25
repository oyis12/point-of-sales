import React, { useContext, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SidebarHeader } from "./SidebarHeader";
import { AiOutlineDashboard, AiOutlineUser, AiOutlineShopping, AiOutlineBars, AiOutlineTag, AiOutlineProfile } from 'react-icons/ai';
import { RiStore2Line } from 'react-icons/ri';
import { MdBatchPrediction } from "react-icons/md";
import AppContext from "../../context/AppContext";

const Sidebar = () => {
  const { toggle, handleToggle, user, getRole } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to) => {
    return location.pathname === to;
  };

  const routeIcons = {
    "/dashboard": <AiOutlineDashboard size={20} />,
    "/dashboard/store": <RiStore2Line size={20} />,
    "/dashboard/staffs": <AiOutlineUser size={20} />,
    "/dashboard/suppliers": <AiOutlineShopping size={20} />,
    "/dashboard/category": <AiOutlineBars size={20} />,
    "/dashboard/product": <AiOutlineTag size={20} />,
    "/dashboard/orders": <AiOutlineProfile size={20} />,
    "/dashboard/batch": <MdBatchPrediction size={20} />
  };

  const roleBasedRoutes = {
    owner: [
      "/dashboard",
      "/dashboard/store",
      "/dashboard/staffs",
      "/dashboard/suppliers",
      "/dashboard/category",
      "/dashboard/product",
      "/dashboard/orders",
      "/dashboard/batch"
    ],
    productManager: [
      "/dashboard",
      "/dashboard/store",
      "/dashboard/suppliers",
      "/dashboard/category",
      "/dashboard/product",
      "/dashboard/orders",
      "/dashboard/batch"
    ],
    storeManager: [
      "/dashboard",
      "/dashboard/store",
      "/dashboard/staffs"
    ],
    cashier: [
      "/cashier",
      "/cashier/pos",
    ]
  };

  const role = getRole(user);
//  console.log('Sidebar:', { user, role, routes: roleBasedRoutes[role] });
  const routesToRender = role ? roleBasedRoutes[role] : [];

// useEffect(() => {
//   if (user && !routesToRender.includes(location.pathname)) {
//     navigate('/unauthorized');
//   }
// }, [location.pathname, routesToRender, navigate, user]);

useEffect(() => {
  if (user && !routesToRender.some(route => location.pathname.startsWith(route))) {
    navigate('/unauthorized');
  }
}, [location.pathname, routesToRender, navigate, user]);


  const handleNavLinkClick = () => {
    handleToggle();
  };

  return (
    <aside className={`sidebar fixed ${toggle ? "sidebar-menuactive " : ""}`}>
      <SidebarHeader profile={user} />
      <ul className="sidebar_list flex flex-col">
        {routesToRender.map((route, index) => (
          <NavLink
            key={index}
            to={route}
            className={`text-decoration-none flex p-4 capitalize ${isActive(route) && "active-link"}`}
            onClick={handleNavLinkClick}
          >
            <div className="flex items-center">
              {routeIcons[route]}
              <span className="ml-2">{route.split("/").pop()}</span>
            </div>
          </NavLink>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;



