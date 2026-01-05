import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { usersAPI } from '@/lib/api';
import { postsAPI } from '@/lib/api';
import DashboardLayout from '@/layout/dashboardLayout';
import type { User, Post } from '@/lib/types';

const AdminDashboard = () => {
  // Fetch users and posts
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: usersAPI.getAll,
  });

  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['allPosts'],
    queryFn: () => postsAPI.getAll(),
  });

  const isLoading = loadingUsers || loadingPosts;

  const pendingUsers = users.filter((u: User) => !u.passwordSet).length;
  const totalUsers = users.length;
  const pendingPosts = posts.filter((p: Post) => p.status === 'PENDING').length;
  const approvedPosts = posts.filter((p: Post) => p.status === 'APPROVED').length;

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

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
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
                  {posts.filter((p: Post) => p.status === 'PENDING').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No pending posts
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts
                        .filter((p: Post) => p.status === 'PENDING')
                        .slice(0, 5)
                        .map((post: Post) => (
                          <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <p className="font-medium">{post.title}</p>
                              <p className="text-sm text-muted-foreground">by {post.author?.email || 'Unknown'}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  {users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No users yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {users.slice(0, 5).map((user: User) => (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">{user.email.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-medium">{user.email}</p>
                              <p className="text-sm text-muted-foreground">{user.role}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            user.passwordSet ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                          }`}>
                            {user.passwordSet ? 'Active' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
