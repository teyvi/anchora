import { useState } from 'react';
import DashboardLayout from '@/layout/dashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, Eye, AlertTriangle } from 'lucide-react';
import {  mockPosts, type Post } from '@/lib/mockData';

const ITEMS_PER_PAGE = 5;

const UserPosts = () => {
  // Filter posts for the current user (demo: john's posts)
  const [posts] = useState<Post[]>(mockPosts.filter(p => p.authorId === '2'));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: Post['status']) => {
    switch (status) {
      case 'approved':
        return <Badge variant="secondary" className="bg-green-500 text-white dark:bg-blue-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">Pending</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">My Posts</h1>
          <p className="text-muted-foreground mt-1">View and manage your submitted posts</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <CardTitle className="flex-1">All Posts</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paginatedPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors animate-fade-in"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium truncate">{post.title}</h3>
                      {getStatusBadge(post.status)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{post.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">Created: {post.createdAt}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewPost(post)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No posts found matching your criteria.
              </div>
            ) : totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Post Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedPost?.title}
              {selectedPost && getStatusBadge(selectedPost.status)}
            </DialogTitle>
            <DialogDescription>
              Created on {selectedPost?.createdAt}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-foreground">{selectedPost?.content}</p>
            
            {selectedPost?.status === 'rejected' && selectedPost.rejectionReason && (
              <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Rejection Reason</span>
                </div>
                <p className="text-sm text-destructive/80">{selectedPost.rejectionReason}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserPosts;
