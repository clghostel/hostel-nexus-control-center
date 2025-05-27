
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Users, Home, TrendingUp, Clock, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Rooms",
      value: "24",
      description: "Active hostel rooms",
      icon: Home,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Occupied Rooms",
      value: "18",
      description: "Currently occupied",
      icon: Bed,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Vacant Beds",
      value: "12",
      description: "Available for booking",
      icon: Users,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Total Guests",
      value: "67",
      description: "Active residents",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Guest Check-in",
      details: "John Doe checked into Room 101",
      time: "2 minutes ago",
      type: "checkin"
    },
    {
      id: 2,
      action: "Room Created",
      details: "Room 205 added as 4-share room",
      time: "15 minutes ago",
      type: "room"
    },
    {
      id: 3,
      action: "Payment Received",
      details: "₹8,000 rent payment from Room 103",
      time: "1 hour ago",
      type: "payment"
    },
    {
      id: 4,
      action: "Guest Profile Updated",
      details: "Sarah Johnson updated contact information",
      time: "2 hours ago",
      type: "update"
    }
  ];

  const upcomingRentAlerts = [
    {
      room: "101",
      guest: "Alice Johnson",
      dueDate: "Tomorrow",
      amount: "₹8,000"
    },
    {
      room: "203",
      guest: "Bob Smith",
      dueDate: "In 2 days",
      amount: "₹6,500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back! Here's what's happening with your hostel.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-slate-400">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Activity Feed */}
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Clock className="h-5 w-5 mr-2 text-cyan-400" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-400">
              Latest updates from your hostel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'checkin' ? 'bg-green-500' :
                      activity.type === 'room' ? 'bg-blue-500' :
                      activity.type === 'payment' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{activity.action}</p>
                    <p className="text-xs text-slate-400">{activity.details}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rent Alerts */}
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <CheckCircle className="h-5 w-5 mr-2 text-orange-400" />
              Upcoming Rent Payments
            </CardTitle>
            <CardDescription className="text-slate-400">
              Payments due soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingRentAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="text-sm font-medium text-white">Room {alert.room}</p>
                    <p className="text-xs text-slate-400">{alert.guest}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{alert.amount}</p>
                    <Badge variant={alert.dueDate === "Tomorrow" ? "destructive" : "secondary"} className="text-xs">
                      {alert.dueDate}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
