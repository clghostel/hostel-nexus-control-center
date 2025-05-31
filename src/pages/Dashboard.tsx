
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Bed, 
  CreditCard, 
  Building, 
  UserPlus,
  Home,
  Settings,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, hostels } = useAuth();

  // Mock stats - in real app, these would come from API
  const mockStats = {
    totalGuests: 45,
    totalRooms: 25,
    occupiedBeds: 38,
    monthlyRevenue: 125000,
    availableRooms: 12
  };

  const quickActions = [
    {
      title: "Add Guest",
      description: "Register a new guest",
      icon: UserPlus,
      action: () => navigate("/guests"),
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "View Rooms",
      description: "Manage room occupancy",
      icon: Home,
      action: () => navigate("/rooms"),
      color: "from-green-500 to-green-600"
    },
    {
      title: "Guest List",
      description: "View all guests",
      icon: Users,
      action: () => navigate("/guests"),
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Room Details",
      description: "View room occupants",
      icon: Eye,
      action: () => navigate("/rooms"),
      color: "from-orange-500 to-orange-600"
    }
  ];

  if (user?.role === 'admin') {
    quickActions.push({
      title: "Settings",
      description: "System configuration",
      icon: Settings,
      action: () => navigate("/settings"),
      color: "from-gray-500 to-gray-600"
    });
  }

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome, {user?.full_name}
        </h1>
        <p className="text-slate-600 text-lg">
          {user?.role === 'admin' 
            ? 'System Administrator Dashboard' 
            : `${user?.hostel?.name} Management Dashboard`
          }
        </p>
      </div>

      {/* Admin View - All Hostels */}
      {user?.role === 'admin' && (
        <Card className="bg-white/50 backdrop-blur border-slate-200/50">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-500" />
              All Hostels Overview
            </CardTitle>
            <CardDescription className="text-slate-600">
              Manage all hostels in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hostels.map((hostel) => (
                <Card key={hostel.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-900">{hostel.name}</CardTitle>
                    <CardDescription className="text-blue-700">
                      {hostel.address}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <p className="text-blue-800">📧 {hostel.email}</p>
                      <p className="text-blue-800">📞 {hostel.phone}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                      <div className="bg-blue-100 p-2 rounded text-center">
                        <div className="font-bold text-blue-900">15</div>
                        <div className="text-blue-700">Guests</div>
                      </div>
                      <div className="bg-indigo-100 p-2 rounded text-center">
                        <div className="font-bold text-indigo-900">8</div>
                        <div className="text-indigo-700">Rooms</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              {user?.role === 'admin' ? 'Total Guests (All)' : 'Total Guests'}
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{mockStats.totalGuests}</div>
            <p className="text-xs text-blue-600">
              Active residents
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Available Rooms
            </CardTitle>
            <Bed className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{mockStats.availableRooms}</div>
            <p className="text-xs text-green-600">
              Out of {mockStats.totalRooms} total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Occupied Beds
            </CardTitle>
            <Building className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{mockStats.occupiedBeds}</div>
            <p className="text-xs text-purple-600">
              Current occupancy
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              Monthly Revenue
            </CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              ₹{mockStats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-orange-600">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/50 backdrop-blur border-slate-200/50" onClick={action.action}>
              <CardHeader>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-slate-800">{action.title}</CardTitle>
                <CardDescription className="text-slate-600">
                  {action.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/50 backdrop-blur border-slate-200/50">
        <CardHeader>
          <CardTitle className="text-slate-800">Recent Activity</CardTitle>
          <CardDescription className="text-slate-600">
            Latest updates from {user?.role === 'admin' ? 'all hostels' : 'your hostel'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-800">New guest registration in Room 101</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-800">Room 202 became available</p>
                <p className="text-xs text-slate-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-800">Monthly rent collected: ₹45,000</p>
                <p className="text-xs text-slate-500">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
