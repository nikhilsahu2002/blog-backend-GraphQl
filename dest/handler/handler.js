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
            },
        },
        // Blogging Api
        Blog: {
            type: (0, graphql_1.GraphQLList)(schema_1.BlogType),
            async resolve() {
                return await Blog_1.default.find();
            },
        },
        comment: {
            type: (0, graphql_1.GraphQLList)(schema_1.CommentType),
            async resolve() {
                return await Comment_1.default.find();
            },
        },
    },
});
const Mutation = new graphql_1.GraphQLObjectType({
    name: "Mutaion",
    fields: {
        SignUp: {
            type: schema_1.UserType,
            args: {
                name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                email: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                password: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
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
            },
        },
        Login: {
            type: schema_1.UserType,
            args: {
                password: { type: graphql_1.GraphQLString },
                email: { type: graphql_1.GraphQLString },
            },
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
            },
        },
        // Add Blog
        addblog: {
            type: schema_1.BlogType,
            args: {
                title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                date: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                user: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
            },
            async resolve(parent, { title, content, date, user }) {
                let blog;
                const session = await (0, mongoose_1.startSession)();
                try {
                    session.startTransaction({ session });
                    blog = new Blog_1.default({ title, content, date, user });
                    const existinguser = await User_1.default.findById(user);
                    if (!existinguser)
                        return new Error("the user Does Not Exist");
                    //@ts-ignore
                    existinguser.blogs.push(blog);
                    await existinguser.save({ session });
                    await blog.save({ session });
                    return blog;
                }
                catch (err) {
                    return new Error(err);
                }
                finally {
                    await session.commitTransaction();
                }
            },
        },
        addcomment: {
            type: schema_1.CommentType,
            args: {
                blog: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
                user: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
                text: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                date: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            async resolve(parent, { user, blog, text, date }) {
                const session = await (0, mongoose_1.startSession)();
                let comment;
                try {
                    session.startTransaction({ session });
                    const existingUser = await User_1.default.findById(user);
                    const existingBlog = await Blog_1.default.findById(blog);
                    if (!existingBlog || !existingUser)
                        return new Error("User Or Blog Does Not Exist");
                    comment = new Comment_1.default({
                        text,
                        date,
                        user,
                        blog,
                    });
                    // @ts-ignore
                    existingBlog.comments.push(comment);
                    // @ts-ignore
                    existingUser.comments.push(comment);
                    await existingBlog.save({ session });
                    await existingUser.save({ session });
                    return await comment.save({ session });
                }
                catch (err) {
                    return new Error(err);
                }
                finally {
                    await session.commitTransaction();
                }
            },
        },
        // Update Blog
        updateblog: {
            type: schema_1.BlogType,
            args: {
                id: { type: graphql_1.GraphQLID },
                title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            async resolve(paraent, { id, title, content }) {
                let blog;
                try {
                    blog = await Blog_1.default.findById(id);
                    if (!blog)
                        return new Error("the id does not exist");
                    return await Blog_1.default.findByIdAndUpdate(id, {
                        title,
                        content,
                    }, { new: true });
                }
                catch (error) {
                    return new Error(error);
                }
            },
        },
        // Delete the Blog
        DeleteBlog: {
            type: schema_1.BlogType,
            args: { id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) } },
            async resolve(paraent, { id }) {
                let existingblog;
                const session = await (0, mongoose_1.startSession)();
                try {
                    session.startTransaction({ session });
                    existingblog = await Blog_1.default.findById(id).populate("user");
                    // @ts-ignore
                    const existinguser = existingblog.user;
                    if (!existinguser)
                        return new Error("No User Linked to this blog");
                    if (!existingblog)
                        return new Error("the blog not exist");
                    existinguser.blogs.pull(existingblog);
                    existinguser.save({ session });
                    return await existinguser.remove({ session });
                }
                catch (error) {
                    return new Error(error);
                }
                finally {
                    session.commitTransaction();
                }
            },
        },
        // Delete Comment
        deletecomment: {
            type: schema_1.CommentType,
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
            },
            async resolve(parent, { id }) {
                let comment = (mongoose_1.Document);
                const session = await (0, mongoose_1.startSession)();
                try {
                    session.startTransaction({ session });
                    comment = await Comment_1.default.findById(id);
                    if (!comment)
                        return new Error("Comment NOt Found");
                    // @ts-ignore
                    const existingUser = await User_1.default.findById(comment?.user);
                    if (!existingUser)
                        return new Error("User Not Find");
                    // @ts-ignore
                    const existingBlog = await Blog_1.default.findById(comment?.blog);
                    if (!existingBlog)
                        return new Error("Blog Not Found");
                    // @ts-ignore
                    existingUser.comments.pull(id);
                    // @ts-ignore
                    existingBlog.comments.pull(id);
                    await existingBlog.save({ session });
                    await existingUser.save({ session });
                    // @ts-ignore
                    return await Comment_1.default.findByIdAndDelete(id);
                }
                catch (error) {
                    return new Error(error);
                }
                finally {
                    await session.commitTransaction();
                }
            },
        },
    },
});
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: Mutation });
//# sourceMappingURL=handler.js.map