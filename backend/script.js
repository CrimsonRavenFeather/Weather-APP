require('dotenv').config()
const cors = require("cors");
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const path = require('path')
app.use(cors());
app.use(express.json())


app.post('/weather', authenticate_token, async (req, res) => {

    // AUTHENTICATE BEFORE WORKING ON THE REQUEST

    try {
        const place = req.body.place
        const weather = await handlesubmit(place)
        res.send(weather)
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
    }
})

// CHECKING TOKENS

function authenticate_token(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null)
        return res.sendStatus(403)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403)   // token expired
        req.user = user
    })

    next()
}

// FETCHING WEATHER REQUEST FROM API

const handlesubmit = async (place) => {
    try {
        const response = fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${place}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/JSON"
            }
        })
        const result = (await response).json()
        return result
    } catch (error) {
        return error
    }
}

app.listen(3030)