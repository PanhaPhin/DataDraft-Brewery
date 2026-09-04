import useAuthStore from "@/store/useAuthStore";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-5 border-b border-border bg-background px-4">
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell size={18} />
        </Button>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium">{user?.name}</div>
            <div className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </div>
          </div>

          <div className="h-9 w-9 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;