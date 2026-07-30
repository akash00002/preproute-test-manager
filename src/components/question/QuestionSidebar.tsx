import type { QuestionDraft } from "../../types/question";
import logo from "../../assets/preproute-logo.svg";
import { NavLink, useLocation } from "react-router-dom";
import dashboardIcon from "../../assets/dash-icon.svg";
import createTestIcon from "../../assets/create-test.svg";
import trackTestIcon from "../../assets/track-test.svg";
import DoubleChevron from "../../assets/DoubleChevron";
import tick from "../../assets/tick.svg";
import dnd from "../../assets/dnd.svg";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: dashboardIcon,
  },
  {
    label: "Test Creation",
    path: "/tests/create/chapterwise",
    matchPrefix: "/tests/create",
    icon: createTestIcon,
  },
  {
    label: "Test Tracking",
    path: "/tests/tracking",
    icon: trackTestIcon,
  },
];

interface QuestionSidebarProps {
  questions: QuestionDraft[];
  currentIndex: number;
  isOpen: boolean;
  isCollapsed: boolean;
  onSelect: (index: number) => void;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export default function QuestionSidebar({
  questions,
  currentIndex,
  isOpen,
  isCollapsed,
  onSelect,
  onClose,
  onToggleCollapse,
}: QuestionSidebarProps) {
  const location = useLocation();
  return (
    <>
      {/* Sidebar backdrop — mobile only */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Reopen button — only visible when sidebar is collapsed (desktop) */}
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          aria-label="Expand sidebar"
          className="hidden lg:flex fixed top-6 left-2 z-50 w-8 h-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-input-border hover:text-text-gray shadow-sm"
        >
          <DoubleChevron className="w-4.5 h-4.5 text-preproute-next rotate-180" />
        </button>
      )}

      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-screen lg:h-screen bg-white border-r border-[#E5E7EB] transition-all duration-200 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${
          isCollapsed
            ? "lg:w-0 lg:overflow-hidden lg:border-r-0"
            : "w-60 lg:w-60"
        }`}
      >
        {/* Logo frame — 240x160 */}
        <div className="w-60 h-40 border-b border-r border-[#E5E7EB] flex items-center px-9 shrink-0">
          <img
            src={logo}
            alt="Preproute"
            style={{ width: "168.99998474121094px", height: "41px" }}
            className="object-contain"
          />
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Icon rail frame — 46x865 */}
          <div className="w-[46px] h-full border-r border-border flex flex-col items-center gap-2.5 pt-31 shrink-0">
            {navItems.map((item) => {
              const isActive = item.matchPrefix
                ? location.pathname.startsWith(item.matchPrefix)
                : location.pathname === item.path;

              const content = (
                <>
                  <img src={item.icon} alt="" className="w-5 h-5" />

                  <span className="absolute left-14 whitespace-nowrap rounded-lg bg-[#111827] px-3 py-2 text-sm text-white opacity-0 -translate-x-2 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 shadow-lg">
                    {item.label}
                  </span>
                </>
              );

              return isActive ? (
                <div
                  key={item.path}
                  className="group relative w-9 h-9 rounded-lg bg-brand-semiWhite flex items-center justify-center cursor-default"
                >
                  {content}
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-50"
                >
                  {content}
                </NavLink>
              );
            })}
          </div>

          {/* Question sidenav frame — 194x865 */}
          <div className="w-48.5 overflow-y-auto shrink-0">
            <div className="flex flex-col px-2.5 pt-25 pb-2.5 gap-7.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-sidebar-text">
                  Question creation
                </p>
                <button
                  onClick={onToggleCollapse}
                  className="hidden lg:block text-input-border hover:text-text-gray"
                  aria-label="Collapse sidebar"
                >
                  <DoubleChevron className="w-4.5 h-4.5 text-preproute-next" />
                </button>
              </div>

              <p className="text-sm font-normal text-sidebar-text">
                Total Questions . {questions.length}
              </p>

              <div className="flex flex-col gap-2.5">
                {questions.map((q, index) => {
                  const isActive = index === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => onSelect(index)}
                      className={`h-8 px-2.5 rounded-lg border-[0.5px] flex items-center justify-between text-[12px] font-normal transition-colors ${
                        isActive
                          ? "bg-success-50 border-success text-success"
                          : q.completed
                            ? "border-success text-success"
                            : "border-input-border text-input-placeholder"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isActive || q.completed ? (
                          <img src={tick} alt="" className="w-4 h-4" />
                        ) : (
                          <img src={dnd} alt="" className="w-4 h-4" />
                        )}
                        {`Question ${index + 1}`}
                      </span>
                      <DoubleChevron
                        className={`w-3 h-3 rotate-180 ${
                          isActive || q.completed
                            ? "text-success"
                            : "text-border-medium"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
