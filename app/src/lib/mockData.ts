export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'active' | 'pending';
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockUsers: User[] = [
  { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'admin', status: 'active', createdAt: '2024-01-01' },
  { id: '2', email: 'john@example.com', name: 'John Doe', role: 'user', status: 'active', createdAt: '2024-01-15' },
  { id: '3', email: 'jane@example.com', name: 'Jane Smith', role: 'user', status: 'pending', createdAt: '2024-02-01' },
  { id: '4', email: 'mike@example.com', name: 'Mike Johnson', role: 'user', status: 'active', createdAt: '2024-02-10' },
  { id: '5', email: 'sarah@example.com', name: 'Sarah Wilson', role: 'user', status: 'active', createdAt: '2024-02-15' },
  { id: '6', email: 'tom@example.com', name: 'Tom Brown', role: 'user', status: 'pending', createdAt: '2024-03-01' },
  { id: '7', email: 'lisa@example.com', name: 'Lisa Davis', role: 'user', status: 'active', createdAt: '2024-03-05' },
  { id: '8', email: 'david@example.com', name: 'David Miller', role: 'user', status: 'active', createdAt: '2024-03-10' },
];

export const mockPosts: Post[] = [
  { id: '1', title: 'Getting Started with React', content: 'This is a comprehensive guide to learning React from scratch...', authorId: '2', authorName: 'John Doe', status: 'approved', createdAt: '2024-03-01', updatedAt: '2024-03-02' },
  { id: '2', title: 'Advanced TypeScript Patterns', content: 'Exploring advanced TypeScript patterns for scalable applications...', authorId: '2', authorName: 'John Doe', status: 'pending', createdAt: '2024-03-10', updatedAt: '2024-03-10' },
  { id: '3', title: 'Tailwind CSS Best Practices', content: 'Learn the best practices for using Tailwind CSS in your projects...', authorId: '4', authorName: 'Mike Johnson', status: 'approved', createdAt: '2024-03-05', updatedAt: '2024-03-06' },
  { id: '4', title: 'State Management in 2024', content: 'A deep dive into modern state management solutions...', authorId: '5', authorName: 'Sarah Wilson', status: 'rejected', rejectionReason: 'Content needs more technical depth and examples.', createdAt: '2024-03-08', updatedAt: '2024-03-09' },
  { id: '5', title: 'Building Accessible UIs', content: 'Accessibility is crucial for modern web applications...', authorId: '4', authorName: 'Mike Johnson', status: 'pending', createdAt: '2024-03-12', updatedAt: '2024-03-12' },
  { id: '6', title: 'Performance Optimization Tips', content: 'Essential tips for optimizing your React applications...', authorId: '7', authorName: 'Lisa Davis', status: 'approved', createdAt: '2024-03-15', updatedAt: '2024-03-16' },
  { id: '7', title: 'Testing React Components', content: 'A complete guide to testing React components with Jest and RTL...', authorId: '8', authorName: 'David Miller', status: 'pending', createdAt: '2024-03-18', updatedAt: '2024-03-18' },
  { id: '8', title: 'CSS Grid vs Flexbox', content: 'Understanding when to use CSS Grid and when to use Flexbox...', authorId: '5', authorName: 'Sarah Wilson', status: 'rejected', rejectionReason: 'Similar content already exists on the platform.', createdAt: '2024-03-20', updatedAt: '2024-03-21' },
  { id: '9', title: 'Introduction to Next.js', content: 'Getting started with Next.js for server-side rendering...', authorId: '2', authorName: 'John Doe', status: 'approved', createdAt: '2024-03-22', updatedAt: '2024-03-23' },
  { id: '10', title: 'GraphQL Fundamentals', content: 'Learn the basics of GraphQL and how it differs from REST...', authorId: '7', authorName: 'Lisa Davis', status: 'pending', createdAt: '2024-03-25', updatedAt: '2024-03-25' },
  { id: '11', title: 'Docker for Frontend Developers', content: 'A practical guide to using Docker in frontend development...', authorId: '8', authorName: 'David Miller', status: 'approved', createdAt: '2024-03-28', updatedAt: '2024-03-29' },
  { id: '12', title: 'Web Security Basics', content: 'Understanding common web security vulnerabilities...', authorId: '4', authorName: 'Mike Johnson', status: 'pending', createdAt: '2024-03-30', updatedAt: '2024-03-30' },
];
