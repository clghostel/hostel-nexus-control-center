
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, User, Building, Mail, MapPin, Trash2, Settings as SettingsIcon, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  hostels?: {
    name: string;
    address: string;
  };
}

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    checkUserRole();
    fetchUsers();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select(`
          *,
          hostels (
            name,
            address
          )
        `)
        .eq('auth_id', user.id)
        .single();

      if (userData) {
        setCurrentUser(userData);
        setIsAdmin(userData.role === 'admin');
        
        if (userData.role !== 'admin') {
          toast({
            title: "Access Denied",
            description: "Only administrators can access settings",
            variant: "destructive",
          });
          navigate("/");
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate("/login");
    }
  };

  const fetchUsers = async () => {
    if (!isAdmin) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          hostels (
            name,
            address
          )
        `);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async () => {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Then create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            auth_id: authData.user.id,
            full_name: newUser.full_name,
            email: newUser.email,
            phone: newUser.phone,
            role: 'staff',
            hostel_id: currentUser?.hostel_id
          }]);

        if (profileError) throw profileError;

        toast({
          title: "✅ User created",
          description: `${newUser.full_name} has been added successfully`,
        });
        
        setNewUser({
          full_name: "",
          email: "",
          phone: "",
          password: "",
        });
        setIsCreateUserDialogOpen(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
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
                Manage admin and staff accounts
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
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-slate-800 font-medium">{user.full_name}</h3>
                    <div className="flex items-center text-sm text-slate-600 mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-sm text-slate-600">
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs px-2 py-1 rounded ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-700 border-red-300' 
                      : 'bg-blue-100 text-blue-700 border-blue-300'
                  }`}>
                    {user.role}
                  </Badge>
                </div>
              </div>
            ))}
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
                defaultValue={currentUser?.hostels?.name || "HostelLog"}
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
