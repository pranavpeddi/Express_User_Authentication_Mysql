const e = require('express')
const { request, response } = require('express')
const sql=require('./db')
const jwt=require('jsonwebtoken')





//for creating first expense
exports.first_create_expense=(req,res)=>{
    const name=req.body.name
    const credit=req.body.credit
    const debit=req.body.debit
    const balance=req.body.balance
    const flag=''
    
    const date=new Date().toISOString().slice(0, 19).replace('T', ' ')
    query1=`insert into expense(name,credit,debit,balance,expense_date,user_id)values( '${name}', '${credit} ', '${debit}' , '${balance}' ,'${date}','${req.session.user_id}')`
    
    if(credit==undefined)
    {
       dBal=balance-debit
        query2=`insert into expense(name,credit,debit,balance,expense_date,user_id)values( '${name}', '0', '${debit}' , '${dBal}' ,'${date}','${req.session.user_id}')`
    sql.query(query2,(err,result)=>{
        if(err)
        throw err
        res.status(200).json({
            message:'expense created'
        })

    })
}
else if(debit==undefined)
{
    cBAL=balance+credit
    query3=`insert into expense(name,credit,debit,balance,expense_date,user_id)values( '${name}', '${credit} ', '0' , '${cBAL}' ,'${date}','${req.session.user_id}')`
    cBAL=balance+credit
    sql.query(query3,(err,result)=>{
        if(err)
        throw err
        res.status(200).json({
            message:'expense created'
        })

    })
}
else
{
    sql.query(query1,(err,result)=>{
        if(err)
        throw err
        res.status(200).json({
            message:'expense created'
        })

    })
}

}


// for updating balance for the existing expense
exports.existing_expense=(req,res)=>
{
    const name=req.body.name
    var credit=req.body.credit
    var debit=req.body.debit
    var finalbalance=0

    if(credit==undefined)
    {
              credit=0
    }
  
    if(debit==undefined)
    {
        debit=0
    }

    const date=new Date().toISOString().slice(0, 19).replace('T', ' ')
    const query=`select balance from expense where eid = (select max(eid) from expense where user_id='${req.session.user_id}')`
  
    sql.query(query,(err,result)=>
    {
        try
        {
            
            if(result)
            {
        console.log(result[0].balance)
        finalbalance=result[0].balance+credit-debit
            }
        }
        catch(err)
        {
         res.status(500).json({
             message:"this may not be your first record of your expense"
         })
        }
        
        if(result)
        {
            query2=`insert into expense(name,credit,debit,balance,expense_date,user_id)values( '${name}', '${credit} ', ${debit}, '${finalbalance}' ,'${date}','${req.session.user_id}')`
            sql.query(query2,(err2,result2)=>{
                try
                {
                    if(result2)
                    {
                        res.status(200).json({
                            message:'done updating balance'
                        })
                    }
                }
                catch(err2)
                {
                    res.status(500).json({
                        message:"unable to update balance"
                    })
                }
                
            })
        }
    })
  }
  



