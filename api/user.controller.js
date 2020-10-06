const{
    create
}=require("./user.service");

const {insertion}=require("../playground/pg")
const {hashSync,genSaltSync,compareSync}=require('bcrypt');

module.exports={
    createUser:(req,res)=>{
        const body=req.body;
        const salt=genSaltSync(10);
        body.password=hashSync(body.password,salt);
        create(body,(err,result)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:0,
                    message:"database connection error"
                });
            }
            return res.status(200).json({
                success:1,
                data:result
            })

        })
    },

    trycheye:(req,res)=>{
        const body=req.body
        insertion(body,(err,result)=>{
            if(err)
            {
                console.log(err);
                return res.status(500).json(
                    {
                        message:"emo"
                    }
                )
            }
            return res.status(200).json(
                {
                    messagee:'success',
                    data:result
                }
            )
        })
    }
}