
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
  Eye,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, hostels } = useAuth();
  const { toast } = useToast();
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isCreateHostelDialogOpen, setIsCreateHostelDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "user" as "admin" | "user",
    hostel_id: ""
  });
  const [newHostel, setNewHostel] = useState({
    name: "",
    address: "",
    email: "",
    phone: ""
  });

  // Realistic stats based on current user
  const getStatsForUser = () => {
    if (user?.role === 'admin') {
      return {
        totalGuests: 45,
        totalRooms: 25,
        occupiedBeds: 38,
        monthlyRevenue: 325000,
        availableRooms: 12
      };
    } else {
      // Individual hostel stats
      return {
        totalGuests: 15,
        totalRooms: 8,
        occupiedBeds: 12,
        monthlyRevenue: 84000,
        availableRooms: 4
      };
    }
  };

  const stats = getStatsForUser();

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
    quickActions.push(
      {
        title: "Create User",
        description: "Add new system user",
        icon: UserPlus,
        action: () => setIsCreateUserDialogOpen(true),
        color: "from-indigo-500 to-indigo-600"
      },
      {
        title: "Create Hostel",
        description: "Add new hostel",
        icon: Plus,
        action: () => setIsCreateHostelDialogOpen(true),
        color: "from-cyan-500 to-cyan-600"
      },
      {
        title: "Settings",
        description: "System configuration",
        icon: Settings,
        action: () => navigate("/settings"),
        color: "from-gray-500 to-gray-600"
      }
    );
  }

  const handleCreateUser = () => {
    toast({
      title: "✅ User created",
      description: `${newUser.full_name} has been added successfully`,
    });
    
    setNewUser({
      full_name: "",
      email: "",
      phone: "",
      password: "",
      role: "user",
      hostel_id: ""
    });
    setIsCreateUserDialogOpen(false);
  };

  const handleCreateHostel = () => {
    toast({
      title: "✅ Hostel created",
      description: `${newHostel.name} has been added successfully`,
    });
    
    setNewHostel({
      name: "",
      address: "",
      email: "",
      phone: ""
    });
    setIsCreateHostelDialogOpen(false);
  };

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
            Latest updates from {user?.role === 'admin' ? 'all hostels' : 'your hostel'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-800">John Doe registered in Room 101</p>
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
                <p className="text-sm text-slate-800">Monthly rent collected: ₹{user?.role === 'admin' ? '45,000' : '28,000'}</p>
                <p className="text-xs text-slate-500">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
        <DialogContent className="bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-slate-800">Create New User</DialogTitle>
            <DialogDescription className="text-slate-600">
              Add a new user to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="userName" className="text-slate-700">Full Name *</Label>
              <Input
                id="userName"
                placeholder="Enter full name"
                className="bg-white border-slate-300"
                value={newUser.full_name}
                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="userEmail" className="text-slate-700">Email *</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="Enter email address"
                className="bg-white border-slate-300"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="userPhone" className="text-slate-700">Phone</Label>
              <Input
                id="userPhone"
                placeholder="Enter phone number"
                className="bg-white border-slate-300"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="userPassword" className="text-slate-700">Password *</Label>
              <Input
                id="userPassword"
                type="password"
                placeholder="Enter password"
                className="bg-white border-slate-300"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="userRole" className="text-slate-700">Role *</Label>
              <Select value={newUser.role} onValueChange={(value: "admin" | "user") => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger className="bg-white border-slate-300">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newUser.role === 'user' && (
              <div>
                <Label htmlFor="userHostel" className="text-slate-700">Hostel *</Label>
                <Select value={newUser.hostel_id} onValueChange={(value) => setNewUser({ ...newUser, hostel_id: value })}>
                  <SelectTrigger className="bg-white border-slate-300">
                    <SelectValue placeholder="Select hostel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hostels.map((hostel) => (
                      <SelectItem key={hostel.id} value={hostel.id}>{hostel.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button onClick={handleCreateUser} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600">
              Create User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Hostel Dialog */}
      <Dialog open={isCreateHostelDialogOpen} onOpenChange={setIsCreateHostelDialogOpen}>
        <DialogContent className="bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-slate-800">Create New Hostel</DialogTitle>
            <DialogDescription className="text-slate-600">
              Add a new hostel to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="hostelName" className="text-slate-700">Hostel Name *</Label>
              <Input
                id="hostelName"
                placeholder="Enter hostel name"
                className="bg-white border-slate-300"
                value={newHostel.name}
                onChange={(e) => setNewHostel({ ...newHostel, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hostelAddress" className="text-slate-700">Address *</Label>
              <Input
                id="hostelAddress"
                placeholder="Enter full address"
                className="bg-white border-slate-300"
                value={newHostel.address}
                onChange={(e) => setNewHostel({ ...newHostel, address: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hostelEmail" className="text-slate-700">Email *</Label>
              <Input
                id="hostelEmail"
                type="email"
                placeholder="Enter email address"
                className="bg-white border-slate-300"
                value={newHostel.email}
                onChange={(e) => setNewHostel({ ...newHostel, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hostelPhone" className="text-slate-700">Phone *</Label>
              <Input
                id="hostelPhone"
                placeholder="Enter phone number"
                className="bg-white border-slate-300"
                value={newHostel.phone}
                onChange={(e) => setNewHostel({ ...newHostel, phone: e.target.value })}
              />
            </div>
            <Button onClick={handleCreateHostel} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600">
              Create Hostel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
