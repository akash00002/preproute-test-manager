import { useAuthStore } from "../store/authStore";
import notificationIcon from "../assets/notification.svg";
import avatar from "../assets/avatar.png";
import downArrow from "../assets/arrow-drop-down.svg";

export default function Topbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="w-300 h-23 bg-white border-b border-border flex items-center justify-end p-5.25">
      <div className="flex items-center gap-5">
        <button className="relative w-12 h-12 rounded-3xl border border-border-medium flex items-center justify-center hover:bg-gray-50 transition-colors">
          <img
            src={notificationIcon}
            alt="Notifications"
            className="w-4.75 h-5.25"
          />

          {/* This is just a visual unread marker for now; it is not wired to notification state yet. */}
          <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-success rounded-full "></span>
        </button>

        <div className="flex items-center gap-2.25 cursor-pointer group">
          <div className="w-12 h-12">
            <img src={avatar} alt="User profile" className="w-full h-full" />
          </div>

          <div className="flex flex-col justify-center gap-1 mr-1">
            <p className="font-semibold text-[16px] text-text-gray leading-tight">
              {/* Fallbacks keep the layout useful while auth state is still hydrating. */}
              {user?.name ?? "Alex Wando"}
            </p>
            <p className="text-[12px] font-normal text-text-gray leading-tight">
              {user?.role ?? "Admin"}
            </p>
          </div>

          <img
            src={downArrow}
            alt="Dropdown menu"
            className="w-6 h-6 shrink-0 self-start mt-px opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </header>
  );
}
