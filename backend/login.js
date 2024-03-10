require('dotenv').config()
const cors = require("cors");
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const path = require('path')
app.use(cors());
app.use(express.json())

let refresh_Tokens = []

app.post('/token' , (req,res)=>{
    const refresh_Token = req.body.token 
    if(refresh_Token == null)
        return res.status(401)
    if(refresh_Tokens.includes(refresh_Token))                                      // [IF REFRESH TOKEN SHOULD'NT BE IN USE]
        return res.status(403)

    jwt.verify(refresh_Token,process.env.REFRESH_TOKEN,(err,user)=>{
        if(err)
            return res.status(401)
        const access_token = token_generator({name : user.name})
        res.json({access_token:access_token})
    })
})

app.post('/login', (req, res) => {
    const user = {
        name: req.body.username,
        email: req.body.email,
        uuid: req.body.uuid                                                         // [THIS UUID SHOULD BE SENT BY USER , SO IT SHOULD BE A PART OF req BODY]
    }

    const access_token = token_generator(user)
    const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN)
    res.json({
        access_token: access_token ,
        refresh_token: refresh_token
    })
})

app.post('/logut',(req,res)=>{                                                      // [THE USER LOG OUT AND DELETE THE REFRESH TOKEN]
    refresh_Tokens = refresh_Tokens.filter(token => token!=req.body.token)
    res.sendStatus(204)
})

function token_generator(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20min" })    // TOKEN EXPIRES IN 10 MINS 
}

app.listen(4040)