import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { postsAPI } from '@/lib/api';
import DashboardLayout from '@/layout/dashboardLayout';
import type { Post } from '@/lib/types';

const UserDashboard = () => {
  // Fetch user's posts
  const { data: userPosts = [], isLoading } = useQuery({
    queryKey: ['myPosts'],
    queryFn: () => postsAPI.getMyPosts(),
  });
  
  const pendingPosts = userPosts.filter((p: Post) => p.status === 'PENDING').length;
  const approvedPosts = userPosts.filter((p: Post) => p.status === 'APPROVED').length;
  const rejectedPosts = userPosts.filter((p: Post) => p.status === 'REJECTED').length;

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
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your posts</p>
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {userPosts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No posts yet. Create your first post to get started!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userPosts.slice(0, 5).map((post: Post) => (
                      <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{post.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {post.status === 'PENDING' && 'Awaiting review'}
                            {post.status === 'APPROVED' && 'Published'}
                            {post.status === 'REJECTED' && 'Rejected - needs revision'}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-4 ${
                          post.status === 'APPROVED' ? 'bg-success/10 text-success' :
                          post.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
