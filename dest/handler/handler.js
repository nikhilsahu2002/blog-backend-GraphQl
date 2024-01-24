"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const schema_1 = require("../Schema/schema");
const User_1 = __importDefault(require("../Model/User"));
const Blog_1 = __importDefault(require("../Model/Blog"));
const Comment_1 = __importDefault(require("../Model/Comment"));
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    fields: {
        users: {
            type: (0, graphql_1.GraphQLList)(schema_1.UserType),
            async resolve() {
                return await User_1.default.find();
            }
        },
        // Blogging Api 
        Blog: {
            type: (0, graphql_1.GraphQLList)(schema_1.BlogType),
            async resolve() {
                return await Blog_1.default.find();
            }
        },
        comment: {
            type: (0, graphql_1.GraphQLList)(schema_1.CommentType),
            async resolve() {
                return await Comment_1.default.find();
            }
        }
    }
});
const Mutation = new graphql_1.GraphQLObjectType({
    name: "Mutaion",
    fields: {
        SignUp: {
            type: schema_1.UserType,
            args: { name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }, email: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }, password: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) } },
            async resolve(paraent, { name, email, password }) {
                let existinguser = (mongoose_1.Document);
                try {
                    existinguser = await User_1.default.findOne({ email });
                    if (existinguser)
                        return new Error("user is already exist");
                    const encryptpassword = (0, bcryptjs_1.hashSync)(password);
                    const user = new User_1.default({ name, email, password: encryptpassword });
                    return await user.save();
                }
                catch (err) {
                    return new Error("user Sign Up Fail");
                }
            }
        },
        Login: {
            type: schema_1.UserType,
            args: { password: { type: graphql_1.GraphQLString }, email: { type: graphql_1.GraphQLString } },
            async resolve(paraent, { email, password }) {
                let existingUser = (mongoose_1.Document);
                try {
                    existingUser = await User_1.default.findOne({ email });
                    if (!existingUser)
                        return new Error("the user does not exist with this email");
                    const decycpta = (0, bcryptjs_1.compareSync)(password, 
                    // @ts-ignore
                    existingUser?.password);
                    if (!decycpta)
                        return new Error("the password does not match");
                    return existingUser;
                }
                catch (error) {
                    return new Error(error);
                }
            }
        },
        // Add Blog
        addblog: {
            type: schema_1.BlogType,
            args: { title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }, content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }, date: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) } },
            async resolve(paraent, { title, content, date }) {
                let blog;
                try {
                    blog = new Blog_1.default({ title, content, date });
                    return await blog.save();
                }
                catch (err) {
                    return new Error(err);
                }
            }
        },
        // Update Blog
        updateblog: {
            type: schema_1.BlogType,
            args: { id: { type: graphql_1.GraphQLID }, title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }, content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) } },
            async resolve(paraent, { id, title, content }) {
                let blog;
                try {
                    blog = await Blog_1.default.findById(id);
                    if (!blog)
                        return new Error("the id does not exist");
                    return await Blog_1.default.findByIdAndUpdate(id, {
                        title,
                        content
                    }, { new: true });
                }
                catch (error) {
                    return new Error(error);
                }
            }
        },
        // Delete the Blog 
        DeleteBlog: {
            type: schema_1.BlogType,
            args: { id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) } },
            async resolve(paraent, { id }) {
                let existingblog;
                try {
                    existingblog = await Blog_1.default.findById(id);
                    if (!existingblog)
                        return new Error("the blog not exist");
                    return await Blog_1.default.findByIdAndDelete(id);
                }
                catch (error) {
                    return new Error(error);
                }
            }
        }
    }
});
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: Mutation });
//# sourceMappingURL=handler.js.map