const {createUser,trycheye}=require("./user.controller")

const router=require("express").Router();

router.post("/",createUser);


router.post("/emo",trycheye);
module.exports=router; 