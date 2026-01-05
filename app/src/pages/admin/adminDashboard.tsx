import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Users, FileText, Clock, CheckCircle } from 'lucide-react';
import { mockUsers, mockPosts } from '@/lib/mockData';
import DashboardLayout from '@/components/layout/DashboardLayout';

const AdminDashboard = () => {
  const pendingUsers = mockUsers.filter(u => u.status === 'pending').length;
  const totalUsers = mockUsers.length;
  const pendingPosts = mockPosts.filter(p => p.status === 'pending').length;
  const approvedPosts = mockPosts.filter(p => p.status === 'approved').length;

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-primary' },
    { label: 'Pending Users', value: pendingUsers, icon: Clock, color: 'text-warning' },
    { label: 'Pending Posts', value: pendingPosts, icon: FileText, color: 'text-muted-foreground' },
    { label: 'Approved Posts', value: approvedPosts, icon: CheckCircle, color: 'text-success' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage users and review posts</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Pending Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPosts
                  .filter(p => p.status === 'pending')
                  .slice(0, 5)
                  .map(post => (
                    <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-muted-foreground">by {post.authorName}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.slice(0, 5).map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
