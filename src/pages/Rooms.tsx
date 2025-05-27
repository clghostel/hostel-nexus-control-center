
import { useState, useEffect } from "react";
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
import { Plus, Bed, Users, Eye, Trash2, Filter, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Room {
  id: string;
  room_number: string;
  sharing_type: number;
  rent_amount: number;
  status: string;
  occupied_beds: number;
  floor_number: number;
  floor_name: string;
  guests: any[];
}

interface Floor {
  id: string;
  floor_number: number;
  floor_name: string;
}

const Rooms = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    room_number: "",
    sharing_type: "",
    rent_amount: "",
    floor_id: "",
  });

  useEffect(() => {
    fetchRooms();
    fetchFloors();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          floors (
            floor_number,
            floor_name
          ),
          guests (
            id,
            full_name,
            phone,
            email
          )
        `);

      if (error) throw error;

      const roomsWithFloorInfo = data?.map(room => ({
        ...room,
        floor_number: room.floors?.floor_number || 0,
        floor_name: room.floors?.floor_name || 'Unknown Floor',
        guests: room.guests || []
      })) || [];

      setRooms(roomsWithFloorInfo);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive",
      });
    }
  };

  const fetchFloors = async () => {
    try {
      const { data, error } = await supabase
        .from('floors')
        .select('*')
        .order('floor_number');

      if (error) throw error;
      setFloors(data || []);
    } catch (error) {
      console.error('Error fetching floors:', error);
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (filterStatus === "all") return true;
    return room.status === filterStatus;
  });

  const groupedRooms = filteredRooms.reduce((acc, room) => {
    const floorKey = `Floor ${room.floor_number} - ${room.floor_name}`;
    if (!acc[floorKey]) {
      acc[floorKey] = [];
    }
    acc[floorKey].push(room);
    return acc;
  }, {} as Record<string, Room[]>);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-700 border-green-300">✅ Available</Badge>;
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">⚠️ Partial</Badge>;
      case "full":
        return <Badge className="bg-red-100 text-red-700 border-red-300">❌ Full</Badge>;
      case "maintenance":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-300">🔧 Maintenance</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleCreateRoom = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: userData } = await supabase
        .from('users')
        .select('hostel_id')
        .eq('auth_id', user.id)
        .single();

      if (!userData) throw new Error('User data not found');

      const roomData = {
        room_number: newRoom.room_number,
        sharing_type: parseInt(newRoom.sharing_type),
        rent_amount: parseFloat(newRoom.rent_amount),
        floor_id: newRoom.floor_id,
        hostel_id: userData.hostel_id,
      };

      const { error } = await supabase
        .from('rooms')
        .insert([roomData]);

      if (error) throw error;

      toast({
        title: "✅ Room created",
        description: `Room ${newRoom.room_number} has been created successfully`,
      });

      setNewRoom({
        room_number: "",
        sharing_type: "",
        rent_amount: "",
        floor_id: "",
      });
      setIsCreateDialogOpen(false);
      fetchRooms();
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Room Management
          </h1>
          <p className="text-slate-600 mt-1">Organize and manage your hostel rooms by floor</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-slate-800">Create New Room</DialogTitle>
              <DialogDescription className="text-slate-600">
                Add a new room to your hostel
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="roomNumber" className="text-slate-700">Room Number</Label>
                <Input
                  id="roomNumber"
                  placeholder="e.g., 101"
                  className="bg-white border-slate-300"
                  value={newRoom.room_number}
                  onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="floor" className="text-slate-700">Floor</Label>
                <Select value={newRoom.floor_id} onValueChange={(value) => setNewRoom({ ...newRoom, floor_id: value })}>
                  <SelectTrigger className="bg-white border-slate-300">
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {floors.map((floor) => (
                      <SelectItem key={floor.id} value={floor.id}>
                        Floor {floor.floor_number} - {floor.floor_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sharing" className="text-slate-700">Sharing Type</Label>
                <Select value={newRoom.sharing_type} onValueChange={(value) => setNewRoom({ ...newRoom, sharing_type: value })}>
                  <SelectTrigger className="bg-white border-slate-300">
                    <SelectValue placeholder="Select sharing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1-share (Single)</SelectItem>
                    <SelectItem value="2">2-share</SelectItem>
                    <SelectItem value="3">3-share</SelectItem>
                    <SelectItem value="4">4-share</SelectItem>
                    <SelectItem value="6">6-share</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rentAmount" className="text-slate-700">Rent Amount (₹)</Label>
                <Input
                  id="rentAmount"
                  type="number"
                  placeholder="Enter rent amount"
                  className="bg-white border-slate-300"
                  value={newRoom.rent_amount}
                  onChange={(e) => setNewRoom({ ...newRoom, rent_amount: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateRoom} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600">
                Create Room
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 backdrop-blur border-slate-200/50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4 text-slate-500" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-white border-slate-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="partial">Partially Occupied</SelectItem>
                <SelectItem value="full">Fully Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rooms by Floor */}
      {Object.entries(groupedRooms).map(([floorName, floorRooms]) => (
        <div key={floorName} className="space-y-4">
          <div className="flex items-center space-x-3">
            <Building className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-800">{floorName}</h2>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              {floorRooms.length} rooms
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {floorRooms.map((room) => (
              <Card key={room.id} className="bg-white/50 backdrop-blur border-slate-200/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-800">Room {room.room_number}</CardTitle>
                    {getStatusBadge(room.status)}
                  </div>
                  <CardDescription className="text-slate-600">
                    {room.sharing_type}-share • ₹{room.rent_amount?.toLocaleString()}/month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-slate-600">
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        Occupancy
                      </div>
                      <span className="text-slate-800 font-medium">
                        {room.occupied_beds}/{room.sharing_type} Occupied
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-600">
                      <Bed className="h-4 w-4 mr-2 text-green-500" />
                      {room.sharing_type - room.occupied_beds} beds available
                    </div>

                    {room.guests.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-slate-500 mb-2">Current Guests:</p>
                        <div className="space-y-1">
                          {room.guests.slice(0, 2).map((guest, index) => (
                            <p key={index} className="text-xs text-slate-700">• {guest.full_name}</p>
                          ))}
                          {room.guests.length > 2 && (
                            <p className="text-xs text-slate-500">+{room.guests.length - 2} more...</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => navigate(`/rooms/${room.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Rooms;
