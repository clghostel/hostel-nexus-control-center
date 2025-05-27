
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Bed, 
  Users, 
  Settings, 
  Plus,
  UserPlus,
  Activity
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Bed, label: "Rooms", path: "/rooms" },
    { icon: Users, label: "Guests", path: "/guests" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const quickActions = [
    { icon: Plus, label: "Add Room", action: () => {} },
    { icon: UserPlus, label: "Add Guest", action: () => {} },
    { icon: Activity, label: "Room Status", action: () => navigate("/rooms") },
  ];

  return (
    <div className="w-64 bg-slate-800/50 backdrop-blur-lg border-r border-slate-700/50 h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50",
                location.pathname === item.path && "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-slate-400 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700/50"
                onClick={action.action}
              >
                <action.icon className="h-4 w-4 mr-3" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
