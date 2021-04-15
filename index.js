const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authroute')
const blogRoutes = require('./routes/blogroutes')
const profileRoutes = require('./routes/profileroute')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        credentials: true,
        origin: 'https://cocky-brown-3dd75c.netlify.app',
    })
)
app.use(authRoutes)

const url =
    'mongodb+srv://sharad:sharad.1998@cluster0.jcjag.mongodb.net/BLOG?retryWrites=true&w=majority'

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>
        app.listen(process.env.PORT || 4000, () => {
            console.log('server created')
        })
    )
    .catch((err) => console.log(err))

app.use(authRoutes)
app.use(blogRoutes)
app.use(profileRoutes)
app.use(cookieParser())

// app.get('/set-cookie',(req,res)=>{
//     res.cookie('newUser',false)
//     res.cookie('What Man',false, {maxAge: 1000*60*60*24, httpOnly:true,secure:true})//what man is cookie name false is value maxage is the time after which cookie is deleted httponly menas we cannot acess cookie using document.cookie
//    // res.setHeader('Set-Cookie','newUser=true');
//     res.send('cookie sent')
// })

// app.get('/read-cookie',(req,res)=>{
//     const cookies=req.cookies
//     console.log(cookies);
//     res.json(cookies)

// })
