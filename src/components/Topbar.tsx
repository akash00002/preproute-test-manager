import { useAuthStore } from "../store/authStore";

export default function Topbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-20 border-b border-gray-100 flex items-center justify-end px-8 gap-4">
      <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center">
        🔔
      </button>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-sm">
          {user?.name?.[0] ?? "U"}
        </div>
        <div className="text-sm">
          <p className="font-medium text-gray-900 leading-tight">
            {user?.name ?? "User"}
          </p>
          <p className="text-gray-400 text-xs leading-tight">
            {user?.role ?? ""}
          </p>
        </div>
      </div>
    </header>
  );
}
