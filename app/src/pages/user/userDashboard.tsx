import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { mockPosts } from '@/lib/mockData';
import { useAuth } from '@/context/authContext';
import DashboardLayout from '@/layout/dashboardLayout';

const UserDashboard = () => {
  const { user } = useAuth();
  
  // Filter posts for the current user (for demo, we'll show john's posts)
  const userPosts = mockPosts.filter(p => p.authorId === '2');
  
  const pendingPosts = userPosts.filter(p => p.status === 'pending').length;
  const approvedPosts = userPosts.filter(p => p.status === 'approved').length;
  const rejectedPosts = userPosts.filter(p => p.status === 'rejected').length;

  const stats = [
    { label: 'Total Posts', value: userPosts.length, icon: FileText, color: 'text-primary' },
    { label: 'Pending', value: pendingPosts, icon: Clock, color: 'text-warning' },
    { label: 'Approved', value: approvedPosts, icon: CheckCircle, color: 'text-success' },
    { label: 'Rejected', value: rejectedPosts, icon: XCircle, color: 'text-destructive' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your posts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userPosts.slice(0, 5).map(post => (
                <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.status === 'pending' && 'Awaiting review'}
                      {post.status === 'approved' && 'Published'}
                      {post.status === 'rejected' && 'Rejected - needs revision'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-4 ${
                    post.status === 'approved' ? 'bg-success/10 text-success' :
                    post.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
