const mongoose = require("mongoose")
const { number } = require("zod")
const Schema = mongoose.Schema
const ObjectId = mongoose.ObjectId

const User = new Schema({
    username : {type: String, unique :true},
    password : String,
})

const Todo = new Schema({
    task: String,
    description: String,
    priority: String,
    label:String,
    category : String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref : "users"}
})

todoModel = mongoose.model("todos", Todo)
userModel = mongoose.model("users", User)

module.exports = {
    userModel,
    todoModel
}