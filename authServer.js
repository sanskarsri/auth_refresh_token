const express= require('express');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const app=express();

app.use(express.json());

const refreshTokens = [];

app.post('/token',(req,res)=>{
    const refreshToken = req.body.token;
    if(refreshToken==null)
        return res.sendStatus(401);
    
    if(!refreshTokens.includes(refreshToken))
        return res.sendStatus(403);
        
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN, (err,user)=>{
        if(err)
            return res.sendStatus(403);
        const accessToken = generateAccessToken({name: user.name});
        res.json({accessToken});
    })
})

app.post('/login',(req,res)=>{
    const username= req.body.username;
    const user = {  name: username};

    const accessToken =  generateAccessToken(user);
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN);
    
    refreshTokens.push(refreshToken);
    console.log(refreshTokens)

    res.json({accessToken, refreshToken})
})

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN,{ expiresIn: '15s' });
}

app.listen(4000,()=>
{
    console.log("server running on port 4000");
})