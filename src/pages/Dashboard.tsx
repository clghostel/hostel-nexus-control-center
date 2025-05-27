
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Bed, 
  CreditCard, 
  TrendingUp, 
  Building, 
  UserPlus,
  Home,
  Settings,
  Eye,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalGuests: 0,
    totalRooms: 0,
    occupiedBeds: 0,
    monthlyRevenue: 0,
    availableRooms: 0
  });
  const [userRole, setUserRole] = useState<string>('');
  const [hostelName, setHostelName] = useState<string>('');

  useEffect(() => {
    fetchDashboardData();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role, hostels(name)')
          .eq('auth_id', user.id)
          .single();
        
        if (userData) {
          setUserRole(userData.role);
          setHostelName(userData.hostels?.name || 'HostelLog');
        }
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const { data: guests } = await supabase
        .from('guests')
        .select('*')
        .eq('status', 'active');

      const { data: rooms } = await supabase
        .from('rooms')
        .select('*');

      if (guests && rooms) {
        const totalGuests = guests.length;
        const totalRooms = rooms.length;
        const occupiedBeds = rooms.reduce((sum, room) => sum + room.occupied_beds, 0);
        const availableRooms = rooms.filter(room => room.status === 'available').length;
        const monthlyRevenue = guests.reduce((sum, guest) => sum + (guest.paying_amount || 0), 0);

        setStats({
          totalGuests,
          totalRooms,
          occupiedBeds,
          monthlyRevenue,
          availableRooms
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
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

  if (userRole === 'admin') {
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
          Welcome to {hostelName}
        </h1>
        <p className="text-slate-600 text-lg">
          Your hostel management dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Total Guests
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalGuests}</div>
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
            <div className="text-2xl font-bold text-green-900">{stats.availableRooms}</div>
            <p className="text-xs text-green-600">
              Out of {stats.totalRooms} total
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
            <div className="text-2xl font-bold text-purple-900">{stats.occupiedBeds}</div>
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
              ₹{stats.monthlyRevenue.toLocaleString()}
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
            Latest updates from your hostel
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
