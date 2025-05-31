
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
    <div className="w-64 bg-white border-r border-slate-200 shadow-sm h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start text-slate-600 hover:text-slate-800 hover:bg-slate-100",
                location.pathname === item.path && "bg-slate-100 text-slate-800 border border-slate-200"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-slate-500 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                className="w-full justify-start text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                onClick={action.action}
              >
                <action.icon className="h-4 w-4 mr-3" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div className="mt-8 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">Logged in as:</div>
          <div className="text-sm text-slate-700 font-medium">{user?.full_name}</div>
          <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
          {user?.hostel && (
            <div className="text-xs text-slate-500 mt-1">{user.hostel.name}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
