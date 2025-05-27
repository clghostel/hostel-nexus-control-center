
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, CreditCard, User } from "lucide-react";

const RoomView = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Mock data for room occupants
  const roomData = {
    id: roomId,
    number: "101",
    sharing: 4,
    occupied: 3,
    status: "partial",
    occupants: [
      {
        id: 1,
        name: "John Doe",
        age: 25,
        phone: "+91 9876543210",
        email: "john.doe@email.com",
        guardianName: "Robert Doe",
        guardianContact: "+91 9876543211",
        purpose: "Job",
        permanentAddress: "123 Main St, Mumbai, Maharashtra",
        officeAddress: "Tech Park, Pune, Maharashtra",
        idNumber: "AADHAR123456789",
        photo: "/placeholder.svg",
        idProof: "aadhar.pdf",
        payingAmount: 8000,
        advanceAmount: 2000,
        joinDate: "2024-01-15",
        dob: "1999-03-20"
      },
      {
        id: 2,
        name: "Jane Smith",
        age: 23,
        phone: "+91 9876543212",
        email: "jane.smith@email.com",
        guardianName: "Mary Smith",
        guardianContact: "+91 9876543213",
        purpose: "Study",
        permanentAddress: "456 Park Ave, Delhi",
        officeAddress: "XYZ College, Mumbai",
        idNumber: "AADHAR987654321",
        photo: "/placeholder.svg",
        idProof: "aadhar.pdf",
        payingAmount: 7500,
        advanceAmount: 1500,
        joinDate: "2024-02-01",
        dob: "2001-07-15"
      },
      {
        id: 3,
        name: "Mike Wilson",
        age: 27,
        phone: "+91 9876543214",
        email: "mike.wilson@email.com",
        guardianName: "David Wilson",
        guardianContact: "+91 9876543215",
        purpose: "Job",
        permanentAddress: "789 Oak St, Bangalore",
        officeAddress: "IT Hub, Pune",
        idNumber: "AADHAR456789123",
        photo: "/placeholder.svg",
        idProof: "aadhar.pdf",
        payingAmount: 8500,
        advanceAmount: 2500,
        joinDate: "2024-01-20",
        dob: "1997-11-08"
      }
    ]
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✅ Available</Badge>;
      case "partial":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">⚠️ Partial</Badge>;
      case "full":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">❌ Full</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/rooms")}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Rooms
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Room {roomData.number}</h1>
          <p className="text-slate-400 mt-1">View occupants and room details</p>
        </div>
      </div>

      {/* Room Summary */}
      <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Room Information</CardTitle>
              <CardDescription className="text-slate-400">
                {roomData.sharing}-share room
              </CardDescription>
            </div>
            {getStatusBadge(roomData.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-slate-700/30">
              <p className="text-2xl font-bold text-white">{roomData.sharing}</p>
              <p className="text-sm text-slate-400">Total Beds</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-700/30">
              <p className="text-2xl font-bold text-cyan-400">{roomData.occupied}</p>
              <p className="text-sm text-slate-400">Occupied</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-700/30">
              <p className="text-2xl font-bold text-green-400">{roomData.sharing - roomData.occupied}</p>
              <p className="text-sm text-slate-400">Available</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Occupants */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Current Occupants</h2>
        
        {roomData.occupants.map((occupant) => (
          <Card key={occupant.id} className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-white">{occupant.name}</CardTitle>
                  <CardDescription className="text-slate-400">
                    Age: {occupant.age} • Joined: {new Date(occupant.joinDate).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Contact Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Contact Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-300">
                      <Phone className="h-4 w-4 mr-2 text-cyan-400" />
                      {occupant.phone}
                    </div>
                    <div className="flex items-center text-slate-300">
                      <Mail className="h-4 w-4 mr-2 text-cyan-400" />
                      {occupant.email}
                    </div>
                    <div className="flex items-start text-slate-300">
                      <Calendar className="h-4 w-4 mr-2 text-cyan-400 mt-0.5" />
                      DOB: {new Date(occupant.dob).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Guardian Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-300">
                      <User className="h-4 w-4 mr-2 text-purple-400" />
                      {occupant.guardianName}
                    </div>
                    <div className="flex items-center text-slate-300">
                      <Phone className="h-4 w-4 mr-2 text-purple-400" />
                      {occupant.guardianContact}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-400">Purpose:</span> {occupant.purpose}
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-300">
                      <CreditCard className="h-4 w-4 mr-2 text-green-400" />
                      Rent: ₹{occupant.payingAmount.toLocaleString()}
                    </div>
                    <div className="flex items-center text-slate-300">
                      <CreditCard className="h-4 w-4 mr-2 text-orange-400" />
                      Advance: ₹{occupant.advanceAmount.toLocaleString()}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-400">ID:</span> {occupant.idNumber}
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-3 md:col-span-2 lg:col-span-3">
                  <h4 className="font-medium text-white">Address Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start text-slate-300">
                      <MapPin className="h-4 w-4 mr-2 text-blue-400 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block">Permanent:</span>
                        {occupant.permanentAddress}
                      </div>
                    </div>
                    <div className="flex items-start text-slate-300">
                      <MapPin className="h-4 w-4 mr-2 text-indigo-400 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block">Office:</span>
                        {occupant.officeAddress}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {roomData.sharing - roomData.occupied > 0 && (
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardContent className="p-6 text-center">
            <p className="text-slate-400 mb-4">
              {roomData.sharing - roomData.occupied} bed(s) available in this room
            </p>
            <Button 
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              onClick={() => navigate("/guests")}
            >
              Add New Guest
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoomView;
