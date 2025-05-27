
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, User, Building, Mail, MapPin, Trash2, Settings as SettingsIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    hostelName: "",
    email: "",
    address: "",
    password: "",
  });

  const users = [
    {
      id: "1",
      name: "John Admin",
      hostelName: "Sunrise Hostel",
      email: "john@sunrisehostel.com",
      address: "123 Main Street, City",
      role: "Admin"
    },
    {
      id: "2",
      name: "Sarah Manager",
      hostelName: "Downtown Lodge",
      email: "sarah@downtown.com",
      address: "456 Park Avenue, City",
      role: "Manager"
    },
  ];

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "✅ User created",
      description: `${newUser.name} has been added successfully`,
    });
    
    setNewUser({
      name: "",
      hostelName: "",
      email: "",
      address: "",
      password: "",
    });
    setIsCreateUserDialogOpen(false);
  };

  const handleDeleteUser = (userName: string) => {
    toast({
      title: "User removed",
      description: `${userName} has been removed from the system`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Manage system settings and user accounts</p>
        </div>
      </div>

      {/* User Management Section */}
      <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-white">
                <User className="h-5 w-5 mr-2 text-cyan-400" />
                User Management
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage admin and staff accounts
              </CardDescription>
            </div>
            <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New User</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Add a new user to the system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userName" className="text-slate-300">Name *</Label>
                    <Input
                      id="userName"
                      placeholder="Enter full name"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hostelName" className="text-slate-300">Hostel Name</Label>
                    <Input
                      id="hostelName"
                      placeholder="Enter hostel name"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      value={newUser.hostelName}
                      onChange={(e) => setNewUser({ ...newUser, hostelName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail" className="text-slate-300">Email *</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="Enter email address"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userAddress" className="text-slate-300">Address</Label>
                    <Textarea
                      id="userAddress"
                      placeholder="Enter address"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      value={newUser.address}
                      onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userPassword" className="text-slate-300">Password *</Label>
                    <Input
                      id="userPassword"
                      type="password"
                      placeholder="Enter password"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateUser} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500">
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{user.name}</h3>
                    <div className="flex items-center text-sm text-slate-400 mt-1">
                      <Building className="h-3 w-3 mr-1" />
                      {user.hostelName}
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <Mail className="h-3 w-3 mr-1" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <MapPin className="h-3 w-3 mr-1" />
                      {user.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                    {user.role}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDeleteUser(user.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <SettingsIcon className="h-5 w-5 mr-2 text-purple-400" />
            System Settings
          </CardTitle>
          <CardDescription className="text-slate-400">
            Configure system preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="systemName" className="text-slate-300">System Name</Label>
              <Input
                id="systemName"
                defaultValue="HostelLog.com"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="defaultCurrency" className="text-slate-300">Default Currency</Label>
              <Input
                id="defaultCurrency"
                defaultValue="₹ (Indian Rupee)"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="rentReminderDays" className="text-slate-300">Rent Reminder (Days Before)</Label>
              <Input
                id="rentReminderDays"
                type="number"
                defaultValue="1"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
