const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//generate access token
const generateAccessToken = (userId:string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '5m' }
  );
};

//generate the refresh token
const generateRefreshToken= (userId:string)=>{
return jwt.sign(
    {userId},
    process.env.JWT_EXPIRES_IN,
    {expiresIn:process.env.JWT_EXPIRES_IN}
);
}

//store refreshed tokens and expire in 7 days
const storeRefreshToken = async (userId:string , token:string) =>{
const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 7); 

await prisma.refreshToken.create({
    data:{
        token,
        userId,
        expiresAt,
        lastUsedAt: new Date()
    }
});
}

//update refresh tokens
const UpdateRefreshToken = async (token:string) =>{
    await prisma.refreshToken.update({
        where:{token},
        data:{ lastUsedAt: new Date()}
    })
}

