
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
  Plus,
  Calendar,
  AlertCircle
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

  // Upcoming payments data (mock)
  const upcomingPayments = [
    { id: 1, guestName: "John Doe", room: "101", amount: 8000, dueDate: "2024-02-05", status: "due" },
    { id: 2, guestName: "Jane Smith", room: "102", amount: 6500, dueDate: "2024-02-07", status: "overdue" },
    { id: 3, guestName: "Mike Johnson", room: "102", amount: 6500, dueDate: "2024-02-10", status: "upcoming" },
    { id: 4, guestName: "Alice Brown", room: "201", amount: 5500, dueDate: "2024-02-12", status: "upcoming" },
  ];

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
      color: "from-slate-600 to-slate-700"
    },
    {
      title: "View Rooms",
      description: "Manage room occupancy",
      icon: Home,
      action: () => navigate("/rooms"),
      color: "from-emerald-600 to-emerald-700"
    },
    {
      title: "Guest List",
      description: "View all guests",
      icon: Users,
      action: () => navigate("/guests"),
      color: "from-blue-600 to-blue-700"
    },
    {
      title: "Room Details",
      description: "View room occupants",
      icon: Eye,
      action: () => navigate("/rooms"),
      color: "from-amber-600 to-amber-700"
    }
  ];

  if (user?.role === 'admin') {
    quickActions.push(
      {
        title: "Create User",
        description: "Add new system user",
        icon: UserPlus,
        action: () => setIsCreateUserDialogOpen(true),
        color: "from-indigo-600 to-indigo-700"
      },
      {
        title: "Create Hostel",
        description: "Add new hostel",
        icon: Plus,
        action: () => setIsCreateHostelDialogOpen(true),
        color: "from-teal-600 to-teal-700"
      },
      {
        title: "Settings",
        description: "System configuration",
        icon: Settings,
        action: () => navigate("/settings"),
        color: "from-slate-600 to-slate-700"
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'due': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'upcoming': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
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
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-800 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-slate-600" />
                  All Hostels Overview
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Manage all hostels in the system
                </CardDescription>
              </div>
              <Dialog open={isCreateHostelDialogOpen} onOpenChange={setIsCreateHostelDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-slate-700 hover:bg-slate-800 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Hostel
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-slate-200 shadow-xl">
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
                        className="bg-white border-slate-300 focus:border-slate-500"
                        value={newHostel.name}
                        onChange={(e) => setNewHostel({ ...newHostel, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hostelAddress" className="text-slate-700">Address *</Label>
                      <Input
                        id="hostelAddress"
                        placeholder="Enter full address"
                        className="bg-white border-slate-300 focus:border-slate-500"
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
                        className="bg-white border-slate-300 focus:border-slate-500"
                        value={newHostel.email}
                        onChange={(e) => setNewHostel({ ...newHostel, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hostelPhone" className="text-slate-700">Phone *</Label>
                      <Input
                        id="hostelPhone"
                        placeholder="Enter phone number"
                        className="bg-white border-slate-300 focus:border-slate-500"
                        value={newHostel.phone}
                        onChange={(e) => setNewHostel({ ...newHostel, phone: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleCreateHostel} className="w-full bg-slate-700 hover:bg-slate-800">
                      Create Hostel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hostels.map((hostel) => (
                <Card key={hostel.id} className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-slate-800">{hostel.name}</CardTitle>
                    <CardDescription className="text-slate-600">
                      {hostel.address}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-700">📧 {hostel.email}</p>
                      <p className="text-slate-700">📞 {hostel.phone}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                      <div className="bg-white p-2 rounded text-center border border-slate-200">
                        <div className="font-bold text-slate-800">15</div>
                        <div className="text-slate-600">Guests</div>
                      </div>
                      <div className="bg-white p-2 rounded text-center border border-slate-200">
                        <div className="font-bold text-slate-800">8</div>
                        <div className="text-slate-600">Rooms</div>
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
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              {user?.role === 'admin' ? 'Total Guests (All)' : 'Total Guests'}
            </CardTitle>
            <Users className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats.totalGuests}</div>
            <p className="text-xs text-slate-600">
              Active residents
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">
              Available Rooms
            </CardTitle>
            <Bed className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">{stats.availableRooms}</div>
            <p className="text-xs text-emerald-600">
              Out of {stats.totalRooms} total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Occupied Beds
            </CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{stats.occupiedBeds}</div>
            <p className="text-xs text-blue-600">
              Current occupancy
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">
              Monthly Revenue
            </CardTitle>
            <CreditCard className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">
              ₹{stats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-amber-600">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payments Section - Only for users */}
      {user?.role === 'user' && (
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-slate-600" />
              Upcoming Payments
            </CardTitle>
            <CardDescription className="text-slate-600">
              Payment due dates from your guests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className={`flex items-center justify-between p-3 rounded-lg border ${getPaymentStatusColor(payment.status)}`}>
                  <div className="flex items-center space-x-3">
                    {payment.status === 'overdue' && <AlertCircle className="h-4 w-4 text-red-500" />}
                    <div>
                      <p className="font-medium text-sm">{payment.guestName}</p>
                      <p className="text-xs opacity-75">Room {payment.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">₹{payment.amount.toLocaleString()}</p>
                    <p className="text-xs opacity-75">Due: {payment.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="group hover:shadow-md transition-all duration-300 cursor-pointer bg-white shadow-sm border-slate-200" onClick={action.action}>
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
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Recent Activity</CardTitle>
          <CardDescription className="text-slate-600">
            Latest updates from {user?.role === 'admin' ? 'all hostels' : 'your hostel'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-800">John Doe registered in Room 101</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-800">Room 202 became available</p>
                <p className="text-xs text-slate-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
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
        <DialogContent className="bg-white border-slate-200 shadow-xl">
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
                className="bg-white border-slate-300 focus:border-slate-500"
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
                className="bg-white border-slate-300 focus:border-slate-500"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="userPhone" className="text-slate-700">Phone</Label>
              <Input
                id="userPhone"
                placeholder="Enter phone number"
                className="bg-white border-slate-300 focus:border-slate-500"
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
                className="bg-white border-slate-300 focus:border-slate-500"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="userRole" className="text-slate-700">Role *</Label>
              <Select value={newUser.role} onValueChange={(value: "admin" | "user") => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger className="bg-white border-slate-300 focus:border-slate-500">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newUser.role === 'user' && (
              <div>
                <Label htmlFor="userHostel" className="text-slate-700">Hostel *</Label>
                <Select value={newUser.hostel_id} onValueChange={(value) => setNewUser({ ...newUser, hostel_id: value })}>
                  <SelectTrigger className="bg-white border-slate-300 focus:border-slate-500">
                    <SelectValue placeholder="Select hostel" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {hostels.map((hostel) => (
                      <SelectItem key={hostel.id} value={hostel.id}>{hostel.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button onClick={handleCreateUser} className="w-full bg-slate-700 hover:bg-slate-800">
              Create User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
