import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/preproute-logo.svg";
import closeIcon from "../../assets/close.svg"; // swap for whatever close icon asset you have

import dashboardIcon from "../../assets/dash-icon.svg";
import createTestIcon from "../../assets/create-test.svg";
import trackTest from "../../assets/track-test.svg";
import { useUIStore } from "../../store/uiStore";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: dashboardIcon,
  },
  {
    label: "Test Creation",
    path: "/tests/create/chapterwise",
    // Any of these routes should keep this item highlighted.
    matchPrefix: "/tests/create",
    icon: createTestIcon,
  },
  {
    label: "Test Tracking",
    path: "/tests/tracking",
    icon: trackTest,
  },
];

export default function Sidebar() {
  const location = useLocation();
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  return (
    <>
      {/* Backdrop — only shown on mobile while the drawer is open */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed z-50 top-0 left-0 w-60 h-screen shrink-0 bg-white border-r border-border flex flex-col transition-transform duration-200 md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mt-5.75 mx-5.5">
          <div className="w-42.25 h-10.25">
            <img
              src={logo}
              alt="Preproute"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Close button — mobile only */}
          <button onClick={closeSidebar} className="md:hidden p-1">
            <img src={closeIcon} alt="Close menu" className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-11.5 flex flex-col gap-1.25 px-0.5">
          {navItems.map((item) => {
            const isActive = item.matchPrefix
              ? location.pathname.startsWith(item.matchPrefix)
              : location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                // Keep the active border in the same flow as every item to avoid a width jump.
                className={`mx-0.5 h-11.5 rounded-lg flex items-center gap-2.25 p-2.5 text-base font-medium transition-colors border-l-[5px] ${
                  isActive
                    ? "bg-brand-semiWhite text-sidebar-active border-sidebar-active"
                    : "text-sidebar-text hover:bg-gray-50 border-transparent"
                }`}
              >
                <img src={item.icon} alt="" className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
