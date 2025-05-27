
import { useState } from "react";
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
import { Plus, User, Phone, Mail, Eye, Trash2, Calendar, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Guests = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({
    fullName: "",
    phone: "",
    dob: "",
    email: "",
    parentName: "",
    parentContact: "",
    purpose: "",
    permanentAddress: "",
    officeAddress: "",
    governmentId: "",
    payingAmount: "",
    advanceAmount: "",
    selectedRoom: "",
  });

  const guests = [
    {
      id: "1",
      fullName: "John Doe",
      phone: "+91 9876543210",
      email: "john.doe@email.com",
      room: "101",
      joinDate: "2024-01-15",
      status: "active",
      rent: "₹8,000",
      photo: "/placeholder.svg"
    },
    {
      id: "2",
      fullName: "Jane Smith",
      phone: "+91 9876543211",
      email: "jane.smith@email.com",
      room: "102",
      joinDate: "2024-02-01",
      status: "active",
      rent: "₹6,500",
      photo: "/placeholder.svg"
    },
  ];

  const availableRooms = [
    { id: "101", name: "Room 101", available: 1, total: 4 },
    { id: "102", name: "Room 102", available: 1, total: 2 },
    { id: "104", name: "Room 104", available: 3, total: 3 },
  ];

  const handleCreateGuest = () => {
    if (!newGuest.fullName || !newGuest.phone || !newGuest.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "✅ Guest profile created",
      description: `${newGuest.fullName} has been added successfully`,
    });
    
    setNewGuest({
      fullName: "",
      phone: "",
      dob: "",
      email: "",
      parentName: "",
      parentContact: "",
      purpose: "",
      permanentAddress: "",
      officeAddress: "",
      governmentId: "",
      payingAmount: "",
      advanceAmount: "",
      selectedRoom: "",
    });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteGuest = (guestName: string) => {
    toast({
      title: "Guest removed",
      description: `${guestName} has been removed from the system`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Guest Management</h1>
          <p className="text-slate-400 mt-1">Create and manage guest profiles</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Create Guest Profile</DialogTitle>
              <DialogDescription className="text-slate-400">
                Add a new guest to your hostel
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-slate-300">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
                    className="bg-slate-700/50 border-slate-600 text-white"
                    value={newGuest.fullName}
                    onChange={(e) => setNewGuest({ ...newGuest, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-slate-300">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    className="bg-slate-700/50 border-slate-600 text-white"
                    value={newGuest.phone}
                    onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dob" className="text-slate-300">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    className="bg-slate-700/50 border-slate-600 text-white"
                    value={newGuest.dob}
                    onChange={(e) => setNewGuest({ ...newGuest, dob: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-300">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    className="bg-slate-700/50 border-slate-600 text-white"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentName" className="text-slate-300">Parent/Guardian Name</Label>
                  <Input
                    id="parentName"
                    placeholder="Enter parent/guardian name"
                    className="bg-slate-700/50 border-slate-600 text-white"
                    value={newGuest.parentName}
                    onChange={(e) => setNewGuest({ ...newGuest, parentName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="parentContact" className="text-slate-300">Parent/Guardian Contact</Label>
                  <Input
                    id="parentContact"
                    placeholder="Enter contact number"
                    className="bg-slate-700/50 border-slate-600 text-white"
                    value={newGuest.parentContact}
                    onChange={(e) => setNewGuest({ ...newGuest, parentContact: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="purpose" className="text-slate-300">Purpose of Staying</Label>
                <Input
                  id="purpose"
                  placeholder="e.g., Work, Study, etc."
                  className="bg-slate-700/50 border-slate-600 text-white"
                  value={newGuest.purpose}
                  onChange={(e) => setNewGuest({ ...newGuest, purpose: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="permanentAddress" className="text-slate-300">Permanent Address</Label>
                <Textarea
                  id="permanentAddress"
                  placeholder="Enter permanent address"
                  className="bg-slate-700/50 border-slate-600 text-white"
                  value={newGuest.permanentAddress}
                  onChange={(e) => setNewGuest({ ...newGuest, permanentAddress: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="officeAddress" className="text-slate-300">Office Address</Label>
                <Textarea
                  id="officeAddress"
                  placeholder="Enter office address"
                  className="bg-slate-700/50 border-slate-600 text-white"
                  value={newGuest.officeAddress}
                  onChange={(e) => setNewGuest({ ...newGuest, officeAddress: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="governmentId" className="text-slate-300">Government ID Number</Label>
                <Input
                  id="governmentId"
                  placeholder="Enter ID number"
                  className="bg-slate-700/50 border-slate-600 text-white"
                  value={newGuest.governmentId}
                  onChange={(e) => setNewGuest({ ...newGuest, governmentId: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Upload Photo</Label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-400">Click to upload photo</p>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300">Upload ID Proof</Label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-400">Click to upload ID</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payingAmount" className="text-slate-300">Paying Amount</Label>
                  <Input
                    id="payingAmount"
                    placeholder="₹ Enter amount"
                    className="bg-slate-700/50 border-slate-600 text-white"
                    value={newGuest.payingAmount}
                    onChange={(e) => setNewGuest({ ...newGuest, payingAmount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="advanceAmount" className="text-slate-300">Advance Amount</Label>
                  <Input
                    id="advanceAmount"
                    placeholder="₹ Enter advance"
                    className="bg-slate-700/50 border-slate-600 text-white"
                    value={newGuest.advanceAmount}
                    onChange={(e) => setNewGuest({ ...newGuest, advanceAmount: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="room" className="text-slate-300">Select Room</Label>
                <Select value={newGuest.selectedRoom} onValueChange={(value) => setNewGuest({ ...newGuest, selectedRoom: value })}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select available room" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {availableRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name} ({room.available}/{room.total} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreateGuest} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500">
                Create Guest Profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Guests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guests.map((guest) => (
          <Card key={guest.id} className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50 hover:border-slate-600/50 transition-colors">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">{guest.fullName}</CardTitle>
                  <CardDescription className="text-slate-400">Room {guest.room}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-300">
                  <Phone className="h-4 w-4 mr-2" />
                  {guest.phone}
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Mail className="h-4 w-4 mr-2" />
                  {guest.email}
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined: {guest.joinDate}
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Active
                  </Badge>
                  <span className="text-white font-medium">{guest.rent}/month</span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDeleteGuest(guest.fullName)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Guests;
