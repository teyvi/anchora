import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

 
//AUTH
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  if (!user.passwordSet) {
    return res.json({ requiresPasswordSetup: true })
  }

  const valid = await bcrypt.compare(password, user.passwordHash!)
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const session = await prisma.userSession.create({
    data: {
      userId: user.id,
      lastActivity: new Date()
    }
  })

  const token = jwt.sign(
    { userId: user.id, role: user.role, sessionId: session.id },
    process.env.JWT_SECRET!,
    { expiresIn: '10m' }
  )

  res.json({ token, role: user.role })
}

export const setPassword = async (req: Request, res: Response) => {
  const { password } = req.body

  const hash = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: req.user?.userId },
    data: {
      passwordHash: hash,
      passwordSet: true
    }
  })

  res.sendStatus(204)
}


  // ADMIN to create user
export const createUser = async (req: Request, res: Response) => {
  const { email, role } = req.body
//check if user is already in the database by name
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return res.status(409).json({ message: 'User already exists' })
  }
//create user
  const user = await prisma.user.create({
    data: {
      email,
      role,
      passwordHash:null,
      passwordSet: false
    }
  })

  res.status(201).json(user)
}

//ADMIN to getUsers
export const getUsers = async () => {
    return prisma.user.findMany({
        select:{
            id:true,
            email:true,
            role:true,
            passwordSet:true,
            isActive:true,
            createdAt:true
        },
        orderBy:{
            createdAt:'desc'
        }
    })
}

//ADMIN to disable users (a soft delete)
export const deactivateUser = async (userId:string) =>{
    return prisma.user.update({
        where:{id:userId},
        data:{
            isActive:false
        }
    })
}

