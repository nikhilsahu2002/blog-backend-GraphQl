import { Schema, model } from "mongoose";

const CommentSchema : Schema = new Schema({
    text : {
        type:String,
        required : true
    },
    date :{
        type : Date,
        required :true

    },
    user:{type : Schema.Types.ObjectId,ref : "user"},
    blog :{type :Schema.Types.ObjectId,ref :"Blog"}
})

export default model("comment",CommentSchema)