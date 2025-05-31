
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
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Bed, label: "Rooms", path: "/rooms" },
    { icon: Users, label: "Guests", path: "/guests" },
  ];

  // Only show settings for admin users
  if (user?.role === 'admin') {
    menuItems.push({ icon: Settings, label: "Settings", path: "/settings" });
  }

  const quickActions = [
    { icon: Plus, label: "Add Room", action: () => navigate("/rooms") },
    { icon: UserPlus, label: "Add Guest", action: () => navigate("/guests") },
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

        {/* User Info */}
        <div className="mt-8 p-3 bg-slate-700/30 rounded-lg">
          <div className="text-xs text-slate-400 mb-1">Logged in as:</div>
          <div className="text-sm text-slate-200 font-medium">{user?.full_name}</div>
          <div className="text-xs text-slate-400 capitalize">{user?.role}</div>
          {user?.hostel && (
            <div className="text-xs text-slate-400 mt-1">{user.hostel.name}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
