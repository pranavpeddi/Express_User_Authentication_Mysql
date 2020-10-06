const pool=require("../config/database");

module.exports=
{
    create:(data,callback)=>
    {
        pool.query(
            `insert into registration(name,email,password) values
            (?,?,?)`
        ),
        [
            data.name,
            data.email,
            data.password
        ],
        (error,res,fields)=>{
            if(error)
            {
                callback(error);
            }
            return callback(null,res)
        }
    },
    
}