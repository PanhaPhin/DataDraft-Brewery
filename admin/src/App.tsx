import Header from "./components/Header";
import Sidebar from "./components/Siderbar";
import { Navigate, Outlet } from "react-router";
import { Toaster } from "./components/ui/sonner";
import useAuthStore from "./store/useAuthStore";
import { useState } from "react";
import { cn } from "./lib/utils";

function App() {
  const { isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div
        className={cn(
          "flex flex-col flex-1 max-w-[--breakpoint-2xl]",
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        <Header />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;