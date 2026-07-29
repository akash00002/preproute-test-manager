import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="mx-auto w-full max-w-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
