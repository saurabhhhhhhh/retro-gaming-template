
const express=require('express')
app=express()
const mongoose=require('mongoose')
app.use(express.json())
const bcrypt =require('bcrypt') 

const cors= require('cors')
const jwt =require('jsonwebtoken')
JWT_KEY="MERN"
// Middleware
app.use(cors())

app.use(express.urlencoded({extended:false}))
mongoose.connect('mongodb+srv://mani:mani2023@cluster0.zz1efzh.mongodb.net/LoginApp?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).
then(()=>app.listen(5000,()=>console.log("Successss"))).catch((error) => console.log(error));

//register 

require('./usermodal')

const User=mongoose.model("Users")
app.post("/register", async (req, res)=>{
    const {username,email} =req.body

    const hashedPass = await bcrypt.hash(req.body.password,10);
    try {
        const oldUser=await User.findOne({username})
        if (oldUser) {
           return res.status(400).json({error:"UserName Already Register !"});
        }
        await User.create({
            username,
            email,
            password:hashedPass
        })
        res.status(200).json("Successful Register");
    } catch (error) {
        res.send({status:error})
    }
})

//login
app.post("/signin", async (req, res)=>{
    const {username,password} =req.body

    const user=await User.findOne({username})

    if (!user) {
        return res.status(400).json({error:"User not Found"});
     }

     if (await bcrypt.compare(password, user.password)) {

        const token = jwt.sign({
            // username:user.username,
          },JWT_KEY, {expiresIn :"1h"})
       
       
     if (res.status(201)) {
        return res.json({user,token});
     }else{
        res.json({ message: error.message });
     }
     } 
     
     res.status(400).json("Wrong Password")
})

app.post("/forget-password",async (req,res)=>{
    const {email} =req.body

    try {
        const oldUser=await User.findOne({email})
        if (!oldUser) {
            return res.json("User not Exists !!")
        }
        const secret=JWT_KEY+oldUser.password
        
        const token = jwt.sign({email:oldUser.email, id:oldUser._id},secret,{
            expiresIn:"5m"
        })
     
        res.json({oldUser,tokenvalue:token})
  
    } catch (error) {
        
    }
    
 })



 app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_KEY + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
  
      res.status(200).json("Password Updated")
    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
    }
  });