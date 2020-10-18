
const dbconfig=require('../config/database')
var mysql=require('mysql')

var con=mysql.createConnection(
    {
        host:dbconfig.HOST,
        user:dbconfig.USER,
        password:dbconfig.PASSWORD,
        database:dbconfig.DATABASE
    }
)

//database connection
con.connect((err)=>{
    if(err)
    throw err
})

module.exports=con