import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/layout/dashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, Check, X, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { postsAPI } from '@/lib/api';
import type { Post } from '@/lib/types';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 5;

const AdminPosts = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  // Fetch posts
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['allPosts', statusFilter !== 'all' ? statusFilter : undefined],
    queryFn: () => postsAPI.getAll(statusFilter !== 'all' ? statusFilter : undefined),
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (postId: string) => postsAPI.approve(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      toast.success('Post approved successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve post');
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ postId, reason }: { postId: string; reason: string }) =>
      postsAPI.reject(postId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      setRejectDialogOpen(false);
      toast.success('Post rejected successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reject post');
    },
  });

  const filteredPosts = posts.filter((post: Post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.author?.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleApprove = (postId: string) => {
    approveMutation.mutate(postId);
  };

  const handleOpenRejectDialog = (post: Post) => {
    setSelectedPost(post);
    setRejectionReason('');
    setRejectionError('');
    setRejectDialogOpen(true);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setRejectionError('Please provide a reason for rejection');
      return;
    }

    if (rejectionReason.length < 10) {
      setRejectionError('Reason must be at least 10 characters');
      return;
    }

    if (selectedPost) {
      rejectMutation.mutate({ postId: selectedPost.id, reason: rejectionReason });
    }
  };

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: Post['status']) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="default">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground mt-1">Review and manage user posts</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
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
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
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
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                Failed to load posts. Please try again.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPosts.map((post: Post) => (
                        <TableRow key={post.id} className="animate-fade-in">
                          <TableCell className="font-medium max-w-xs truncate">
                            {post.title}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{post.author?.email || 'Unknown'}</TableCell>
                          <TableCell>{getStatusBadge(post.status)}</TableCell>
                          <TableCell className="text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewPost(post)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {post.status === 'PENDING' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-success hover:text-success hover:bg-success/10"
                                    onClick={() => handleApprove(post.id)}
                                    disabled={approveMutation.isPending}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleOpenRejectDialog(post)}
                                    disabled={rejectMutation.isPending}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredPosts.length === 0 && !isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No posts found matching your criteria.
                  </div>
                ) : (
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
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Post Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
            <DialogDescription>
              By {selectedPost?.author?.email || 'Unknown'} • {selectedPost ? new Date(selectedPost.createdAt).toLocaleDateString() : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-foreground">{selectedPost?.content}</p>
            {selectedPost?.status === 'REJECTED' && selectedPost.rejectionReason && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm font-medium text-destructive">Rejection Reason:</p>
                <p className="text-sm text-destructive/80 mt-1">{selectedPost.rejectionReason}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <div className="flex items-center gap-2">
              {getStatusBadge(selectedPost?.status || 'PENDING')}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Post Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Post</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{selectedPost?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this post is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className={rejectionError ? 'border-destructive' : ''}
                disabled={rejectMutation.isPending}
              />
              {rejectionError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {rejectionError}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRejectDialogOpen(false)}
              disabled={rejectMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminPosts;
