import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { AlertTriangle } from 'lucide-react';

interface Task {
  task: string;
  due: string;
  priority: string;
}

interface UpcomingTasksProps {
  tasks: Task[];
}

export const UpcomingTasks: React.FC<UpcomingTasksProps> = ({ tasks }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Upcoming Tasks
        </CardTitle>
        <CardDescription>
          Tasks and requirements for your loan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">{task.task}</p>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">Due: {task.due}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 