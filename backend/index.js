const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken")
const {auth, JWT_SECRET} = require("./auth")
const mongoose = require("mongoose")
const {z} = require("zod")
const bcrypt = require("bcrypt")
const {userModel, todoModel} = require("./db");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(cors({
    origin:"https://taskify-nu-five.vercel.app/"
}))


app.post("/create-todo",auth,async (req, res)=>{
    const todoToAdd = req.body
    const userId = new mongoose.Types.ObjectId(req.userId)
    await todoModel.create({
        task:todoToAdd.task,
        description:todoToAdd.description,
        priority:todoToAdd.priority,
        label:todoToAdd.label,
        category:"todos",
        userId:userId
    })
    const todos = await todoModel.find({
        userId:userId,
        category:"todos"
    })
    res.status(200).json({message:"todo-added",todos})

})

app.get("/",auth, async (req,res)=>{
    const userId = new mongoose.Types.ObjectId(req.userId)
    const todos = await todoModel.find({
        userId:userId,
        category:"todos"
    })
    const inProgress = await todoModel.find({
        userId:userId,
        category:"inProgress"
    })
    const underReview = await todoModel.find({
        userId:userId,
        category:"underReview"
    })
    const finished = await todoModel.find({
        userId:userId,
        category:"finished"
    })
    res.status(200).json({message:"todo-added",todos,inProgress,underReview,finished})    
})

app.post("/delete-todo",auth, async(req, res)=>{
    const userId =  new mongoose.Types.ObjectId(req.userId)
    const taskId = new mongoose.Types.ObjectId(req.body.taskid)
    await todoModel.deleteOne({
        _id:taskId,
        userId: userId
    })
    const todos = await todoModel.find({
        userId:userId,
        category:"todos"
    })
    const inProgress = await todoModel.find({
        userId:userId,
        category:"inProgress"
    })
    const underReview = await todoModel.find({
        userId:userId,
        category:"underReview"
    })
    const finished = await todoModel.find({
        userId:userId,
        category:"finished"
    })
    res.status(200).json({message:"todo-added",todos,inProgress,underReview,finished})
    
})

app.post("/update",auth,async (req,res)=>{
    const userId =  new mongoose.Types.ObjectId(req.userId)
    const taskId = new mongoose.Types.ObjectId(req.body.boxid)
    const updateTo = (req.body).targetId 
    if(updateTo == "main1"){
        await todoModel.updateOne(
            {_id:taskId, userId:userId},
            {$set : {category:"todos"}}
        )
    }else if(updateTo == "main2"){
        await todoModel.updateOne(
            {_id:taskId, userId:userId},
            {$set : {category:"inProgress"}}
        )
    }else if(updateTo == "main3"){
        await todoModel.updateOne(
            {_id:taskId, userId:userId},
            {$set : {category:"underReview"}}
        )
    }else if(updateTo == "main4"){
        await todoModel.updateOne(
            {_id:taskId, userId:userId},
            {$set : {category:"finished"}}
        )
    }
    const todos = await todoModel.find({
        userId:userId,
        category:"todos"
    })
    const inProgress = await todoModel.find({
        userId:userId,
        category:"inProgress"
    })
    const underReview = await todoModel.find({
        userId:userId,
        category:"underReview"
    })
    const finished = await todoModel.find({
        userId:userId,
        category:"finished"
    })
    res.status(200).json({message:"todo-added",todos,inProgress,underReview,finished})
})

app.post("/signup",async (req,res)=>{
    try{
        const username = req.body.username
        const password = req.body.password
        const userValidation = z.object({
            username: z.string().min(3).max(50),
            password: z.string().min(3).max(50)
        })

        const parsedData = userValidation.safeParse({username:username,password:password})
        if(!parsedData.success){
            res.json({message:"incorrect-format"})
            return
        }

        let foundUser = null

        foundUser = await userModel.findOne({
            username:username,
        })

        if(foundUser){
            res.json({message:"user-already-exists"})
        }else{
            const hashedPassword = await bcrypt.hash(password,7)
            await userModel.create({
                username:username,
                password: hashedPassword,
                totalTodos:0
            })
            res.json({message:"user-added-succesfully",username,hashedPassword})
        }

    }catch(err){
        res.json({message:"error while signup ",error:err})
    }
    
})

app.post("/signin",async (req,res)=>{
    const username = req.body.username
    const password = req.body.password

    const foundUser = await userModel.findOne({
        username:username
    })
    if(foundUser){
        const match = await bcrypt.compare(password,foundUser.password)
        console.log(match)
        if(match){
            const token = jwt.sign({
                userId:foundUser._id.toString()
            },JWT_SECRET)
            res.json({message:"login-succesfull",token})
        }else{
            console.log("1")
            res.json({message:"user-not-found"})
        }
    }else{
        console.log("2")
        res.json({message:"user-not-found"})
    }
})


app.listen(port, ()=> console.log(`server is running at http://localhost:${port}`));

