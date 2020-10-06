require("dotenv").config();
const express=require('express');
const bodyparser=require('body-parser')
const app=express();

app.use(bodyparser.urlencoded({extended:false}))

const {trycheye}=require("./api/user.controller")

app.use(express.json())

const userRouter=require("./api/user.router")
 
app.use("/api/users",userRouter);

app.use("/natry",trycheye);



app.listen(process.env.APP_PORT ,()=>{
    console.log("server up and running "+process.env.APP_PORT);
})

