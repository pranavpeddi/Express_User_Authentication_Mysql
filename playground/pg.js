const {createPool}=require('mysql')
const express=require('express')
const {sign}=require('jsonwebtoken')
const morgan=require('morgan')
const {checkToken}=require('../auth/auth')
var mysql=require('mysql')
const app=express();
require('dotenv').config();
const bodyparser=require('body-parser');
const { json } = require('body-parser')

var session=require('express-session')
const dbconfig=require('../config/database')
const sql_obj=require("./db")
const {hashSync,genSaltSync,compareSync, compare}=require('bcrypt');
var jsonParser=bodyparser.json()
app.use(bodyparser.urlencoded({extended:false}))
app.use(morgan('combined'))
const {
    first_create_expense,
    existing_expense,generateId
}=require('./business')
const con = require('./db')


app.use(session({
    secret:"secret",
    resave: true, 
  
    // Forces a session that is "uninitialized" 
    // to be saved to the store 
    saveUninitialized: true
}));

//retrieves users, if found.
app.get("/getallUsers",checkToken,jsonParser,(req,res)=>{
    
        var sql='select * from users'
        sql_obj.query(sql,(err,result)=>{
            if(err)
            throw err;
            if(result)
            {

            
            console.log(result)
            res.status(200).json({
                data:result
            })
            }
            else
            {
                res.status(500).json(
                    {
                        data:'no users found'
                    }
                )
            }
        })
    
})




//End point for users
app.post('/registration',jsonParser,(req,res)=>{
    pranavInsertion(req,res);
})

//retrieve data for the email provided
app.post('/getEmail',checkToken,jsonParser,(req,res)=>
{
   getUserByUserEmailL(req,res);
})

app.post('/existingExpense',jsonParser,existing_expense)

//API for login
app.post('/login',  jsonParser,(req,res)=>{
    login(req,res); 
})

app.post('/createExpense',jsonParser,checkToken,(req,res)=>{
    first_create_expense(req,res)
})

login=(req,res)=>{
  const body=req.body
 
      var sql=`select uid,password  from users where email='${body.email}' `
      sql_obj.query(sql,(err,results)=>{
          if(err)
          {
              throw err;
          }
          if(!results)
          {
              return res.json({
                  status:'failed',
                  message:'false email id is provided, please try again'
              })
          }
          else
          {
              console.log(results[0].password)
              const result=compareSync(body.password,results[0].password)
              if(result)
              {
                  result.password=undefined;
                  console.log(results[0].uid)
                req.session.user_id=results[0].uid
                  const jsontoken=sign({result:results},"qwe12345",{expiresIn:"1h"});
                  console.log(jsontoken)
                  return res.json({
                      success:1,
                      token:jsontoken
                  }
                  )
              }
              else
              {
                  return res.json({
                      success:0,
                      data:'invalid email or password'
                  })
              }

          }
      })
  
}

// function for inserting data
pranavInsertion=(req,res)=>{
   
        console.log('connected')
        const body=req.body
        const salt=genSaltSync(10)
        var password=hashSync(body.password,salt);
        var sql=`insert into users(name,password,email) values('${req.body.name}','${password}','${req.body.email}')`;
        con.query(sql,(err,result)=>{
            if(err)
            {
                throw err;
            }
            return res.status(200).json(
                {
                    data:result
                } )

        }


    )

}


changePassword=(req,res)=>{
    

    const body=req.body
    console.log('cp is fired----->',body)
    const salt=genSaltSync(10)
    var hashpassword=hashSync(body.newpassword,salt);
    
    var sql=`update users set password='${hashpassword}' where email='${req.body.email}'`;
    var passwordQuery=`select password from users where email='${body.email}'`
  sql_obj.query(passwordQuery,(err,result)=>{
        if(err)
        throw err
        if(result)
        {
    console.log(result)
        }
        const loginflag=compareSync(body.password,result[0].password)
        
        

       if(loginflag)
       {
         sql_obj.query(sql,(err2,result2)=>{
               if(err2)
               throw err2
               console.log(result2)
               return res.status(200).json({
                   message:'password has changed successfully, please login'
               })
           })
       }
       else
       {
           return res.status(500).json({
               message:'please provide right credentials to change password'
           })
       }   
    })
}



//function to fetch for the mail provided
getUserByUserEmailL=(req,res)=>{
               
        const body=req.body
        var sql=`select name,password from users where email='${body.email}'`
        con.query(sql,(err,result)=>{
            if(err)
            throw err
            if(result)
            {
                console.log(result[0])
               return res.status(200).json({
                   success:0,
                   data:result[0]
               }) 
            }
            else
            {
return res.status(500).json({
    data:'not found or try again'
})
            }
        })
}


app.patch('/changePassword',jsonParser,(req,res)=>{
    changePassword(req,res);
})





app.post('/no',jsonParser,(req,res)=>{
    console.log('i am fired')
    console.log(req.body.password)
    return res.status(200).json(
        {
            data:req.body.password
        }
    )
})




app.listen(3000,()=>{
    console.log('server is up and running')
})


