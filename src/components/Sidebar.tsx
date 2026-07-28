import { NavLink } from "react-router-dom";
import logo from "../assets/preproute-logo.svg";

import dashboardIcon from "../assets/dash-icon.svg";
import createTestIcon from "../assets/create-test.svg";
import trackTest from "../assets/track-test.svg";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: dashboardIcon,
  },
  {
    label: "Test Creation",
    path: "/tests/create",
    icon: createTestIcon,
  },
  {
    label: "Test Tracking",
    path: "/tests/tracking",
    icon: trackTest,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-60 h-screen shrink-0 bg-white border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="w-42.25 h-10.25 mt-5.75 ml-5.5">
        <img
          src={logo}
          alt="Preproute"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="mt-11.5 flex flex-col gap-1.25 px-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `mx-0.5 h-11.5 rounded-lg flex items-center gap-2.25 p-2.5 text-base font-medium transition-colors border-l-[5px] ${
                isActive
                  ? "bg-brand-semiWhite text-sidebar-active border-sidebar-active" // Colored border when active
                  : "text-sidebar-text hover:bg-gray-50 border-transparent" // Transparent border when inactive
              }`
            }
          >
            <img src={item.icon} alt="" className="w-5 h-5 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
