import { Schema, model } from "mongoose";

const CommentSchema : Schema = new Schema({
    text : {
        type:String,
        required : true
    },
    date :{
        type : Date,
        required :true

    }
})

export default model("comment",CommentSchema)