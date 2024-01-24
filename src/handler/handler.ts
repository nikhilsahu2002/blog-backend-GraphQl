import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import { BlogType, CommentType, UserType } from "../Schema/schema"
import User from "../Model/User"
import Blog from "../Model/Blog";
import Comment from "../Model/Comment";
import { query } from "express";
import { Document } from "mongoose";
import { hashSync ,compareSync } from "bcryptjs";

const RootQuery = new GraphQLObjectType({
    name : "RootQuery",
    fields:{
        users:{
            type :GraphQLList(UserType),
            async resolve(){
                return await User.find();
            }
        },

        // Blogging Api 
        Blog : {
            type: GraphQLList(BlogType),
            async resolve(){
                return await Blog.find();
            }
        },
        comment : {
            type : GraphQLList(CommentType),
            async resolve(){
                return await Comment.find();
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name:"Mutaion",
    fields:{
        SignUp : {
            type :UserType,
            args:{name:{type:GraphQLNonNull(GraphQLString)} ,email:{type:GraphQLNonNull(GraphQLString)},password:{type:GraphQLNonNull(GraphQLString)}},
            async resolve(paraent,{name,email,password}){
                let existinguser = Document<any,any,any>;
                try{
                    existinguser = await User.findOne({email});
                    if(existinguser) return new Error("user is already exist")
                    const encryptpassword = hashSync(password);
                    const user = new User({name,email,password : encryptpassword});
                    return await user.save();
                }
                catch(err){
                    return new Error("user Sign Up Fail")
                }
            }
            
        },
        Login :{
            type:UserType,
            args : {password :{type : GraphQLString},email : { type: GraphQLString}},
            async resolve(paraent ,{email,password}){
               let existingUser = Document<any,any,any>;
               try {
                existingUser = await User.findOne({email})
                if(!existingUser) return new Error("the user does not exist with this email");

                const decycpta = compareSync(password ,
                    // @ts-ignore
                    existingUser?.password)
                
                if(!decycpta) return new Error("the password does not match");
                return existingUser;
               } catch (error) {
                return new Error(error)
                
               }
               
            }
        },
        // Add Blog
        addblog : {
            type : BlogType,
            args : {title : {type : GraphQLNonNull(GraphQLString)},content:{type:GraphQLNonNull(GraphQLString)},date :{type : GraphQLNonNull(GraphQLString)}},
            async resolve(paraent,{title,content ,date}){
                let blog : Document<any,any,any>;
                try{
                 blog =  new Blog({title,content,date})
                return await blog.save();
            }catch(err){
                return new Error(err);
            }
            }
        },
        // Update Blog
        updateblog : {
            type : BlogType,
            args:{id : {type : GraphQLID}, title : {type : GraphQLNonNull(GraphQLString)},content : {type : GraphQLNonNull(GraphQLString)}},
            async resolve(paraent,{id,title,content}){
                let blog : Document<any,any,any>
                try {
                    blog = await Blog.findById(id)
                    if(!blog) return new Error("the id does not exist")
                    return await Blog.findByIdAndUpdate(id,{
                        title,
                        content
                    },{new : true})
                } catch (error) {
                    return new Error(error);
                } 
            }
        },
        // Delete the Blog 
        DeleteBlog : {
            type:BlogType,
            args : {id :{type : GraphQLNonNull(GraphQLID)}},
            async resolve(paraent,{id}){
                let existingblog : Document<any,any,any>
                try{
                existingblog = await Blog.findById(id);
                if(!existingblog) return new Error("the blog not exist")

                return await Blog.findByIdAndDelete(id);
            }catch(error){
                return new Error(error)
            }
            }

        }
       
    }
})

export default new GraphQLSchema({query: RootQuery,mutation :Mutation});