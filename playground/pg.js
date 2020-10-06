const {createPool}=require('mysql')
const express=require('express')

var mysql=require('mysql')
const app=express();
require('dotenv').config();
const bodyparser=require('body-parser');
const { json } = require('body-parser');

app.use(bodyparser.urlencoded({extended:false}))

const {hashSync,genSaltSync,compareSync, compare}=require('bcrypt');

var jsonParser=bodyparser.json()

const {sign}=require('jsonwebtoken')

const {checkToken}=require('../auth/auth')


var con=mysql.createConnection(
    {
        host:"localhost",
        user:"root",

        password:"msdhoni07",
        database:"pikinav"
    }
)



con.connect((err)=>{
    if(err)
    throw err
})

//retrieves users, if found.
app.get("/getallUsers",checkToken,jsonParser,(req,res)=>{
    
        var sql='select * from registration'
        con.query(sql,(err,result)=>{
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


//End point for registration
app.post('/registration',checkToken,jsonParser,(req,res)=>{
    pranavInsertion(req,res);
})

//retrieve data for the email provided
app.post('/getEmail',checkToken,jsonParser,(req,res)=>
{
   getUserByUserEmailL(req,res);
})



app.post('/login',jsonParser,(req,res)=>{
    login(req,res); 
})

login=(req,res)=>{
  const body=req.body
 
      var sql=`select password  from registration where email='${body.email}' `
      con.query(sql,(err,results)=>{
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
                  const jsontoken=sign({result:results},"qwe12345",{expiresIn:"1h"});
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


pranavInsertion=(req,res)=>{
    con.connect((err)=>{
        if(err)
        throw err;
        console.log('connected')
        const body=req.body
        const salt=genSaltSync(10)
        var password=hashSync(body.password,salt);
        var sql=`insert into registration(name,password,email) values('${req.body.name}','${password}','${req.body.email}')`;
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
})
}

//function to fetch for the mail provided
getUserByUserEmailL=(req,res)=>{
    con.connect((err)=>{
        if(err)
        throw err
        const body=req.body
        var sql=`select name,password from registration where email='${body.email}'`
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
    })
}

app.post("/my",jsonParser,(req,res)=>{
    
    con.connect((err)=>{
        if(err)
        throw err;
        console.log('connected');
        var sql=`insert into last (name,password) values('${req.body.name}','${req.body.password}')`;
        con.query(sql,(err,result)=>{
            if(err)
            {
                throw err;
            }
            return res.status(200).json({
                data:'success'
            })
        })
    })
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


app.post('/imp')

app.listen(3000,()=>{
    console.log('server is up and running')
})


