const e = require('express')
const { request, response } = require('express')
const sql=require('./db')


exports.first_create_expense=(req,res)=>{
    const name=req.body.name
    const credit=req.body.credit
    const debit=req.body.debit
    const balance=req.body.balance
    const flag=''
    
    const date=new Date().toISOString().slice(0, 19).replace('T', ' ')
    query1=`insert into expense(name,credit,debit,balance,expense_date)values( '${name}', '${credit} ', '${debit}' , '${balance}' ,'${date}')`
    
    if(credit==undefined)
    {
        query2=`insert into expense(name,credit,debit,balance,expense_date)values( '${name}', '0', '${debit}' , '${balance}' ,'${date}')`
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
    query3=`insert into expense(name,credit,debit,balance,expense_date)values( '${name}', '${credit} ', '0' , '${balance}' ,'${date}')`
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
    const query=`select balance from expense where eid = (select max(eid) from expense)`
    sql.query(query,(err,result)=>
    {
        if(err)
        throw err
        console.log(result[0].balance)
        finalbalance=result[0].balance+credit-debit
        
        if(result)
        {
            query2=`insert into expense(name,credit,debit,balance,expense_date)values( '${name}', '${credit} ', ${debit}, '${finalbalance}' ,'${date}')`
            sql.query(query2,(err2,result2)=>{
                if(err2)
                throw err2
                res.status(200).json({
                    message:'done updating balance'
                })
            })
        }
    })

}
