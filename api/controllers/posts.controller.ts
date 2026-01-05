import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { PostStatus } from '../generated/prisma/enums'


//pagination
export const getPagination = (query: any) => {
  const page = Math.max(Number(query.page) || 1, 1)
  const limit = Math.min(Number(query.limit) || 10, 100)

  return {
    skip: (page - 1) * limit,
    take: limit
  }
}

//user post creation
export const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body

  if (!req.user?.userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      userId: req.user.userId
    }
  })

  res.status(201).json(post)
}

export const getMyPosts = async (req: Request, res: Response) => {
  const { skip, take } = getPagination(req.query)

  const posts = await prisma.post.findMany({
    where: {
      userId: req.user?.userId,
      ...(req.query.status && { status: req.query.status as any })
    },
    skip,
    take,
    orderBy: { createdAt: 'desc' }
  })

  res.json(posts)
}

// Admin get all posts
export const getAllPosts = async (req: Request, res: Response) => {
  const { skip, take } = getPagination(req.query)

  const posts = await prisma.post.findMany({
    where: {
      ...(req.query.status && { status: req.query.status as any })
    },
    skip,
    take,
    orderBy: { createdAt: 'desc' }
  })

  // Fetch authors separately to avoid include issues
  const postsWithAuthors = await Promise.all(
    posts.map(async (post) => {
      const author = await prisma.user.findUnique({
        where: { id: post.userId },
        select: { id: true, email: true }
      })
      return { ...post, author }
    })
  )

  res.json(postsWithAuthors)
}
//admin post approval
export const approvePost = async (req: Request, res: Response) => {
  const post = await prisma.post.update({
    where: { id: req.params.id },
    data: {
      status: 'APPROVED',
      rejectionReason: null
    }
  })

  res.json(post)
}

export const rejectPost = async (req: Request, res: Response) => {
  const { reason } = req.body

  if (!reason) {
    return res.status(400).json({ message: 'Reason is required' })
  }

  const post = await prisma.post.update({
    where: { id: req.params.id },
    data: {
      status: 'REJECTED',
      rejectionReason: reason
    }
  })

  res.json(post)
}


