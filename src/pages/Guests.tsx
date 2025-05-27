
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, User, Phone, Mail, Eye, Search, Filter, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Guest {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  parent_name: string;
  parent_contact: string;
  purpose: string;
  permanent_address: string;
  office_address: string;
  government_id: string;
  photo_url: string;
  paying_amount: number;
  advance_amount: number;
  join_date: string;
  status: string;
  room_number?: string;
  sharing_type?: number;
}

interface Room {
  id: string;
  room_number: string;
  sharing_type: number;
  rent_amount: number;
  occupied_beds: number;
}

const Guests = () => {
  const { toast } = useToast();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({
    full_name: "",
    phone: "",
    email: "",
    date_of_birth: "",
    parent_name: "",
    parent_contact: "",
    purpose: "",
    permanent_address: "",
    office_address: "",
    government_id: "",
    room_id: "",
    paying_amount: "",
    advance_amount: "",
  });

  useEffect(() => {
    fetchGuests();
    fetchRooms();
  }, []);

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select(`
          *,
          rooms (
            room_number,
            sharing_type,
            rent_amount
          )
        `);

      if (error) throw error;

      const guestsWithRoomInfo = data?.map(guest => ({
        ...guest,
        room_number: guest.rooms?.room_number,
        sharing_type: guest.rooms?.sharing_type
      })) || [];

      setGuests(guestsWithRoomInfo);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch guests",
        variant: "destructive",
      });
    }
  };

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .neq('status', 'full');

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.phone.includes(searchTerm) ||
                         guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.room_number?.includes(searchTerm);
    
    const matchesFilter = filterStatus === "all" || guest.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 border-green-300">✅ Active</Badge>;
      case "inactive":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">⏸️ Inactive</Badge>;
      case "checked_out":
        return <Badge className="bg-red-100 text-red-700 border-red-300">🔴 Checked Out</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleCreateGuest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: userData } = await supabase
        .from('users')
        .select('hostel_id')
        .eq('auth_id', user.id)
        .single();

      if (!userData) throw new Error('User data not found');

      const guestData = {
        ...newGuest,
        hostel_id: userData.hostel_id,
        paying_amount: parseFloat(newGuest.paying_amount) || 0,
        advance_amount: parseFloat(newGuest.advance_amount) || 0,
        room_id: newGuest.room_id || null,
      };

      const { error } = await supabase
        .from('guests')
        .insert([guestData]);

      if (error) throw error;

      toast({
        title: "✅ Guest created",
        description: `${newGuest.full_name} has been registered successfully`,
      });

      setNewGuest({
        full_name: "",
        phone: "",
        email: "",
        date_of_birth: "",
        parent_name: "",
        parent_contact: "",
        purpose: "",
        permanent_address: "",
        office_address: "",
        government_id: "",
        room_id: "",
        paying_amount: "",
        advance_amount: "",
      });
      setIsCreateDialogOpen(false);
      fetchGuests();
    } catch (error) {
      console.error('Error creating guest:', error);
      toast({
        title: "Error",
        description: "Failed to create guest",
        variant: "destructive",
      });
    }
  };

  const handleViewProfile = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Guest Management
          </h1>
          <p className="text-slate-600 mt-1">Manage your hostel guests and registrations</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-slate-200 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-slate-800">Register New Guest</DialogTitle>
              <DialogDescription className="text-slate-600">
                Add a new guest to your hostel
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="text-slate-700">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter full name"
                  className="bg-white border-slate-300"
                  value={newGuest.full_name}
                  onChange={(e) => setNewGuest({ ...newGuest, full_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-slate-700">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  className="bg-white border-slate-300"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  className="bg-white border-slate-300"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dob" className="text-slate-700">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  className="bg-white border-slate-300"
                  value={newGuest.date_of_birth}
                  onChange={(e) => setNewGuest({ ...newGuest, date_of_birth: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="parentName" className="text-slate-700">Parent/Guardian Name</Label>
                <Input
                  id="parentName"
                  placeholder="Enter parent name"
                  className="bg-white border-slate-300"
                  value={newGuest.parent_name}
                  onChange={(e) => setNewGuest({ ...newGuest, parent_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="parentContact" className="text-slate-700">Parent Contact</Label>
                <Input
                  id="parentContact"
                  placeholder="Enter parent contact"
                  className="bg-white border-slate-300"
                  value={newGuest.parent_contact}
                  onChange={(e) => setNewGuest({ ...newGuest, parent_contact: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="purpose" className="text-slate-700">Purpose</Label>
                <Select value={newGuest.purpose} onValueChange={(value) => setNewGuest({ ...newGuest, purpose: value })}>
                  <SelectTrigger className="bg-white border-slate-300">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Job">Job</SelectItem>
                    <SelectItem value="Study">Study</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="govId" className="text-slate-700">Government ID</Label>
                <Input
                  id="govId"
                  placeholder="Aadhar/PAN number"
                  className="bg-white border-slate-300"
                  value={newGuest.government_id}
                  onChange={(e) => setNewGuest({ ...newGuest, government_id: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="room" className="text-slate-700">Assign Room</Label>
                <Select value={newGuest.room_id} onValueChange={(value) => setNewGuest({ ...newGuest, room_id: value })}>
                  <SelectTrigger className="bg-white border-slate-300">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        Room {room.room_number} ({room.sharing_type}-share) - ₹{room.rent_amount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payingAmount" className="text-slate-700">Monthly Rent</Label>
                <Input
                  id="payingAmount"
                  type="number"
                  placeholder="Enter amount"
                  className="bg-white border-slate-300"
                  value={newGuest.paying_amount}
                  onChange={(e) => setNewGuest({ ...newGuest, paying_amount: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="permanentAddress" className="text-slate-700">Permanent Address</Label>
                <Textarea
                  id="permanentAddress"
                  placeholder="Enter permanent address"
                  className="bg-white border-slate-300"
                  value={newGuest.permanent_address}
                  onChange={(e) => setNewGuest({ ...newGuest, permanent_address: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="officeAddress" className="text-slate-700">Office/College Address</Label>
                <Textarea
                  id="officeAddress"
                  placeholder="Enter office/college address"
                  className="bg-white border-slate-300"
                  value={newGuest.office_address}
                  onChange={(e) => setNewGuest({ ...newGuest, office_address: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Button onClick={handleCreateGuest} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600">
                  Register Guest
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/50 backdrop-blur border-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search guests by name, phone, email, or room..."
                className="pl-10 bg-white border-slate-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 bg-white border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Guests</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="checked_out">Checked Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuests.map((guest) => (
          <Card key={guest.id} className="bg-white/50 backdrop-blur border-slate-200/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-800">{guest.full_name}</CardTitle>
                    <CardDescription className="text-slate-600">
                      {guest.room_number ? `Room ${guest.room_number}` : 'No room assigned'}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(guest.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <Phone className="h-4 w-4 mr-2 text-blue-500" />
                  {guest.phone}
                </div>
                {guest.email && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                    {guest.email}
                  </div>
                )}
                {guest.room_number && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Building className="h-4 w-4 mr-2 text-blue-500" />
                    {guest.sharing_type}-share • ₹{guest.paying_amount?.toLocaleString()}/month
                  </div>
                )}
                <div className="flex items-center text-sm text-slate-600">
                  <span className="font-medium">Purpose:</span>
                  <span className="ml-2">{guest.purpose || 'Not specified'}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => handleViewProfile(guest)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Guest Profile Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-white border-slate-200 max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedGuest && (
            <>
              <DialogHeader>
                <DialogTitle className="text-slate-800 text-xl">{selectedGuest.full_name}</DialogTitle>
                <DialogDescription className="text-slate-600">
                  Complete guest profile and details
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Photo */}
                <div className="col-span-full flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 border-b pb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium text-slate-600">Phone:</span> {selectedGuest.phone}</div>
                    <div><span className="font-medium text-slate-600">Email:</span> {selectedGuest.email || 'Not provided'}</div>
                    <div><span className="font-medium text-slate-600">Date of Birth:</span> {selectedGuest.date_of_birth || 'Not provided'}</div>
                    <div><span className="font-medium text-slate-600">Government ID:</span> {selectedGuest.government_id || 'Not provided'}</div>
                  </div>
                </div>

                {/* Guardian Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 border-b pb-2">Guardian Details</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium text-slate-600">Name:</span> {selectedGuest.parent_name || 'Not provided'}</div>
                    <div><span className="font-medium text-slate-600">Contact:</span> {selectedGuest.parent_contact || 'Not provided'}</div>
                    <div><span className="font-medium text-slate-600">Purpose:</span> {selectedGuest.purpose || 'Not specified'}</div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 border-b pb-2">Financial Details</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium text-slate-600">Monthly Rent:</span> ₹{selectedGuest.paying_amount?.toLocaleString()}</div>
                    <div><span className="font-medium text-slate-600">Advance:</span> ₹{selectedGuest.advance_amount?.toLocaleString()}</div>
                    <div><span className="font-medium text-slate-600">Join Date:</span> {selectedGuest.join_date}</div>
                  </div>
                </div>

                {/* Room Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 border-b pb-2">Room Details</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium text-slate-600">Room Number:</span> {selectedGuest.room_number || 'Not assigned'}</div>
                    <div><span className="font-medium text-slate-600">Sharing Type:</span> {selectedGuest.sharing_type ? `${selectedGuest.sharing_type}-share` : 'N/A'}</div>
                    <div><span className="font-medium text-slate-600">Status:</span> {getStatusBadge(selectedGuest.status)}</div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="col-span-full space-y-4">
                  <h3 className="font-semibold text-slate-800 border-b pb-2">Address Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-slate-600">Permanent Address:</span>
                      <p className="text-slate-700 mt-1">{selectedGuest.permanent_address || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Office/College Address:</span>
                      <p className="text-slate-700 mt-1">{selectedGuest.office_address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Guests;
