import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Clock from "lucide-react/dist/esm/icons/clock";
import User from "lucide-react/dist/esm/icons/user";
import Shield from "lucide-react/dist/esm/icons/shield";
import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle";
import CheckCircle from "lucide-react/dist/esm/icons/check-circle";

interface ActivityItem {
  id: string;
  type: "user" | "security" | "system" | "approval";
  title: string;
  description: string;
  user: string;
  avatar?: string;
  time: string;
  status: "success" | "warning" | "error" | "info";
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "user",
    title: "New user registration",
    description: "john.doe@example.com registered and is pending approval",
    user: "System",
    time: "2 minutes ago",
    status: "info",
  },
  {
    id: "2",
    type: "security",
    title: "Failed login attempt",
    description: "Multiple failed attempts from IP 192.168.1.100",
    user: "Security Monitor",
    time: "15 minutes ago",
    status: "warning",
  },
  {
    id: "3",
    type: "approval",
    title: "User approved",
    description: "jane.smith@example.com account has been approved",
    user: "Admin User",
    avatar: "/avatars/admin.jpg",
    time: "1 hour ago",
    status: "success",
  },
  {
    id: "4",
    type: "system",
    title: "System backup completed",
    description: "Daily backup completed successfully",
    user: "System",
    time: "2 hours ago",
    status: "success",
  },
  {
    id: "5",
    type: "security",
    title: "Suspicious activity detected",
    description: "Unusual data access pattern from user mike.wilson@example.com",
    user: "Security Monitor",
    time: "3 hours ago",
    status: "error",
  },
];

const getActivityIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "user":
      return User;
    case "security":
      return Shield;
    case "system":
      return CheckCircle;
    case "approval":
      return CheckCircle;
    default:
      return Clock;
  }
};

const getStatusIcon = (status: ActivityItem["status"]) => {
  switch (status) {
    case "success":
      return CheckCircle;
    case "warning":
      return AlertTriangle;
    case "error":
      return AlertTriangle;
    case "info":
      return Clock;
    default:
      return Clock;
  }
};

const getStatusColor = (status: ActivityItem["status"]) => {
  switch (status) {
    case "success":
      return "text-green-600";
    case "warning":
      return "text-yellow-600";
    case "error":
      return "text-red-600";
    case "info":
      return "text-blue-600";
    default:
      return "text-muted-foreground";
  }
};

export function RecentActivity() {
  return (
    <Card className="border-futuristic">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const ActivityIcon = getActivityIcon(activity.type);
          const StatusIcon = getStatusIcon(activity.status);
          
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card/50">
              <div className="flex-shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback className="text-xs">
                    {activity.user.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{activity.title}</span>
                  <StatusIcon className={`h-4 w-4 ${getStatusColor(activity.status)}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    by {activity.user}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
