import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  User,
  Users,
  Tag,
  Layers,
  Package,
  FileText,
  Beer,
  Warehouse,
  Star,
  Percent,
  BarChart3,
  Settings,
  Truck,
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { NavLink } from "react-router";

type NavItemProp = {
  to: string;
  icon: React.ReactNode;
  label: string;
  open: boolean;
  end?: boolean;
};

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const navigationItems = [
  {
    to: "/dashboard",
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    end: true,
  },
  {
    to: "/dashboard/account",
    icon: <User size={20} />,
    label: "Account",
  },
  {
    to: "/dashboard/users",
    icon: <Users size={20} />,
    label: "Users",
  },
  {
    to: "/dashboard/products",
    icon: <Beer size={20} />,
    label: "Products",
  },
  {
    to: "/dashboard/orders",
    icon: <Package size={20} />,
    label: "Orders",
  },
  {
    to: "/dashboard/invoices",
    icon: <FileText size={20} />,
    label: "Invoices",
  },
  {
    to: "/dashboard/inventory",
    icon: <Warehouse size={20} />,
    label: "Inventory",
  },
  {
    to: "/dashboard/suppliers",
    icon: <Truck size={20} />,
    label: "Suppliers",
  },
  {
    to: "/dashboard/banners",
    icon: <Layers size={20} />,
    label: "Banners",
  },
  {
    to: "/dashboard/categories",
    icon: <Tag size={20} />,
    label: "Categories",
  },
  {
    to: "/dashboard/brands",
    icon: <Tag size={20} />,
    label: "Brands",
  },
  {
    to: "/dashboard/promotions",
    icon: <Percent size={20} />,
    label: "Promotions",
  },
  {
    to: "/dashboard/reviews",
    icon: <Star size={20} />,
    label: "Reviews",
  },
  {
    to: "/dashboard/reports",
    icon: <BarChart3 size={20} />,
    label: "Reports",
  },
  {
    to: "/dashboard/settings",
    icon: <Settings size={20} />,
    label: "Settings",
  },
];

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const { user, logout } = useAuthStore();

  return (
    <motion.aside
      initial={{ width: open ? 256 : 80 }}
      animate={{ width: open ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-y-0 left-0 z-20 flex flex-col border-r border-slate-700/50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl"
    >
      <div className="flex items-center justify-between p-4 h-16 bg-gradient-to-r from-[#29beb3] via-slate-700 to-[#a96bde] border border-slate-600/50">
        <motion.div
          className={cn(
            "flex items-center overflow-hidden",
            open ? "w-auto opacity-100" : "w-0 opacity-0"
          )}
          initial={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
          animate={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="font-bold text-xl text-white drop-shadow-lg">
            Vattanac Brewery
          </span>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setOpen(!open)}
            className="rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/20 hover:border-white/30 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: open ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft size={20} />
            </motion.div>
          </Button>
        </motion.div>
      </div>

      <div className="flex flex-col flex-1 gap-1 p-3 bg-gradient-to-b from-slate-900/50 text-white to-slate-800/50 overflow-y-auto">
        {navigationItems?.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label || ""}
            icon={item.icon} 
            end={item.end}
            open={open}
          />
        ))}
      </div>

      <div className="p-4 border-t border-slate-600/50 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
        <motion.div
          className={cn(
            "flex items-center gap-3 mb-4",
            open ? "justify-start" : "justify-center"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#29beb3] to-[#a96bde] flex items-center justify-center text-white font-semibold overflow-hidden shadow-lg ring-2 ring-white/20">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="userImage"
                className="h-full w-full object-cover"
              />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-sm font-medium text-white truncate max-w-[150px]">
                  {user?.name}
                </span>
                <span className="text-xs text-[#29beb3] capitalize font-medium bg-slate-700/50 px-2 py-1 rounded-full backdrop-blur-sm">
                  {user?.role}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <Button
          variant="outline"
          size={open ? "default" : "icon"}
          onClick={() => logout()}
          className="w-full border-red-500/30 hover:bg-red-600/20 hover:border-red-400/50 text-red-400 hover:text-red-300 transition-colors bg-red-600/10 backdrop-blur-sm"
        >
          <LogOut size={16} className={cn("mr-2", !open && "mr-0")} />
          {open && "Logout"}
        </Button>
      </div>
    </motion.aside>
  );
};

function NavItem({ to, icon, label, open, end }: NavItemProp) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center p-3 rounded-xl text-sm font-medium hoverEffect gap-3 overflow-hidden text-white/80 hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50 hover:text-white hover:shadow-lg hover:backdrop-blur-sm",
          isActive
            ? "bg-gradient-to-r from-[#29beb3]/20 to-[#a96bde]/20 text-white shadow-lg shadow-[#29beb3]/20 scale-105 ring-1 ring-[#29beb3]/30 border border-white/10 backdrop-blur-sm"
            : "text-slate-300 hover:scale-102"
        )
      }
    >
      <span>{icon}</span>
      {open && <span>{label}</span>}
    </NavLink>
  );
}

export default Sidebar;