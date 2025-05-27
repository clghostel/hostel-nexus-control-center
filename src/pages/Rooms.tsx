
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Bed, Users, Eye, Trash2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Rooms = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    number: "",
    sharing: "",
  });

  const rooms = [
    {
      id: "101",
      number: "101",
      sharing: 4,
      occupied: 3,
      status: "partial",
      guests: ["John Doe", "Jane Smith", "Mike Wilson"]
    },
    {
      id: "102",
      number: "102",
      sharing: 2,
      occupied: 1,
      status: "partial",
      guests: ["Sarah Johnson"]
    },
    {
      id: "103",
      number: "103",
      sharing: 4,
      occupied: 4,
      status: "full",
      guests: ["Alex Brown", "Emma Davis", "Chris Lee", "Lisa Wang"]
    },
    {
      id: "104",
      number: "104",
      sharing: 3,
      occupied: 0,
      status: "available",
      guests: []
    },
    {
      id: "201",
      number: "201",
      sharing: 2,
      occupied: 2,
      status: "full",
      guests: ["David Miller", "Sophie Taylor"]
    },
    {
      id: "202",
      number: "202",
      sharing: 1,
      occupied: 0,
      status: "available",
      guests: []
    }
  ];

  const filteredRooms = rooms.filter(room => {
    if (filterStatus === "all") return true;
    return room.status === filterStatus;
  });

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

  const handleCreateRoom = () => {
    if (!newRoom.number || !newRoom.sharing) {
      toast({
        title: "All fields required",
        description: "Please fill in all room details",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "✅ Room created",
      description: `Room ${newRoom.number} has been created successfully`,
    });
    
    setNewRoom({ number: "", sharing: "" });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteRoom = (roomNumber: string) => {
    toast({
      title: "Room deleted",
      description: `Room ${roomNumber} has been removed`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Rooms Management</h1>
          <p className="text-slate-400 mt-1">Create and manage your hostel rooms</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Room</DialogTitle>
              <DialogDescription className="text-slate-400">
                Add a new room to your hostel
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="roomNumber" className="text-slate-300">Room Number</Label>
                <Input
                  id="roomNumber"
                  placeholder="e.g., 101"
                  className="bg-slate-700/50 border-slate-600 text-white"
                  value={newRoom.number}
                  onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="sharing" className="text-slate-300">Sharing Type</Label>
                <Select value={newRoom.sharing} onValueChange={(value) => setNewRoom({ ...newRoom, sharing: value })}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select sharing type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="1">1-share (Single)</SelectItem>
                    <SelectItem value="2">2-share</SelectItem>
                    <SelectItem value="3">3-share</SelectItem>
                    <SelectItem value="4">4-share</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateRoom} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500">
                Create Room
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Rooms</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="partial">Partially Occupied</SelectItem>
                <SelectItem value="full">Fully Occupied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50 hover:border-slate-600/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Room {room.number}</CardTitle>
                {getStatusBadge(room.status)}
              </div>
              <CardDescription className="text-slate-400">
                {room.sharing}-share room
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-slate-300">
                    <Users className="h-4 w-4 mr-2" />
                    Occupancy
                  </div>
                  <span className="text-white font-medium">
                    {room.occupied}/{room.sharing} Occupied
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-slate-300">
                  <Bed className="h-4 w-4 mr-2" />
                  {room.sharing - room.occupied} beds available
                </div>

                {room.occupied > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-400 mb-2">Current Guests:</p>
                    <div className="space-y-1">
                      {room.guests.slice(0, 2).map((guest, index) => (
                        <p key={index} className="text-xs text-slate-300">• {guest}</p>
                      ))}
                      {room.guests.length > 2 && (
                        <p className="text-xs text-slate-400">+{room.guests.length - 2} more...</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:text-white"
                    onClick={() => navigate(`/rooms/${room.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Occupants
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDeleteRoom(room.number)}
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

export default Rooms;
