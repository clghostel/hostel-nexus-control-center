
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, User, Building, Mail, Settings as SettingsIcon, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, users, hostels } = useAuth();
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "user" as "admin" | "user",
    hostel_id: ""
  });

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md bg-white/50 backdrop-blur border-slate-200/50">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Access Denied</h2>
            <p className="text-slate-600">Only administrators can access settings.</p>
            <Button 
              onClick={() => navigate("/")} 
              className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateUser = () => {
    // Mock user creation
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

  const getUserHostel = (hostelId: string | null) => {
    if (!hostelId) return null;
    return hostels.find(h => h.id === hostelId);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-slate-600 mt-1">Manage system settings and user accounts</p>
        </div>
      </div>

      {/* User Management Section */}
      <Card className="bg-white/50 backdrop-blur border-slate-200/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-slate-800">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                User Management
              </CardTitle>
              <CardDescription className="text-slate-600">
                Manage admin and staff accounts across all hostels
              </CardDescription>
            </div>
            <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((userData) => {
              const userHostel = getUserHostel(userData.hostel_id);
              return (
                <div key={userData.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      userData.role === 'admin' 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                    }`}>
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-slate-800 font-medium">{userData.full_name}</h3>
                      <div className="flex items-center text-sm text-slate-600 mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {userData.email}
                      </div>
                      {userData.phone && (
                        <div className="flex items-center text-sm text-slate-600">
                          <span>{userData.phone}</span>
                        </div>
                      )}
                      {userHostel && (
                        <div className="flex items-center text-sm text-slate-600 mt-1">
                          <Building className="h-3 w-3 mr-1" />
                          {userHostel.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs px-2 py-1 rounded ${
                      userData.role === 'admin' 
                        ? 'bg-red-100 text-red-700 border-red-300' 
                        : 'bg-blue-100 text-blue-700 border-blue-300'
                    }`}>
                      {userData.role}
                    </Badge>
                    {userData.role === 'user' && userHostel && (
                      <Badge className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 border-green-300">
                        {userHostel.name}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Hostels Overview */}
      <Card className="bg-white/50 backdrop-blur border-slate-200/50">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800">
            <Building className="h-5 w-5 mr-2 text-green-500" />
            Hostels Overview
          </CardTitle>
          <CardDescription className="text-slate-600">
            All hostels in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hostels.map((hostel) => {
              const hostelUsers = users.filter(u => u.hostel_id === hostel.id);
              return (
                <Card key={hostel.id} className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-900">{hostel.name}</CardTitle>
                    <CardDescription className="text-green-700 text-sm">
                      {hostel.address}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="space-y-1 text-sm">
                      <p className="text-green-800 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {hostel.email}
                      </p>
                      <p className="text-green-800">📞 {hostel.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-green-900 mb-1">Assigned Users:</p>
                      {hostelUsers.length > 0 ? (
                        <div className="space-y-1">
                          {hostelUsers.map(u => (
                            <Badge key={u.id} variant="outline" className="text-xs mr-1 bg-green-50 border-green-300">
                              {u.full_name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-green-600 italic">No users assigned</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="bg-white/50 backdrop-blur border-slate-200/50">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800">
            <SettingsIcon className="h-5 w-5 mr-2 text-purple-500" />
            System Settings
          </CardTitle>
          <CardDescription className="text-slate-600">
            Configure system preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="systemName" className="text-slate-700">System Name</Label>
              <Input
                id="systemName"
                defaultValue="HostelLog"
                className="bg-white border-slate-300"
              />
            </div>
            <div>
              <Label htmlFor="defaultCurrency" className="text-slate-700">Default Currency</Label>
              <Input
                id="defaultCurrency"
                defaultValue="₹ (Indian Rupee)"
                className="bg-white border-slate-300"
              />
            </div>
            <div>
              <Label htmlFor="rentReminderDays" className="text-slate-700">Rent Reminder (Days Before)</Label>
              <Input
                id="rentReminderDays"
                type="number"
                defaultValue="3"
                className="bg-white border-slate-300"
              />
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
