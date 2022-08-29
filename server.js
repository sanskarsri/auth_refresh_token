const express= require('express');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const app=express();

app.use(express.json());

const posts=[
    {
        username: 'Sanskar',
        title: 'Post 1'
    },
    {
        username: 'Sri',
        title: 'Post 2'
    }
];

app.get('/posts', authenticateToken,(req,res)=>{
    // if(!(req.user && req.user.name))
    //     res.sendStatus(401);

    res.json(posts.filter(post => req.user ? post.username === req.user.name : null));
    
});

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // Since it is returned in form Bearer TOKEN

    if(token==null)
        return res.sendStatus(401);

    jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
        if(err)
            res.sendStatus(403);
        
        req.user=user;
        next();
    })

}

app.listen(3000,()=>
{
    console.log("server running on port 3000");
})