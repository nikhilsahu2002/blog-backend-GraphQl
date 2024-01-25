import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { BlogType, CommentType, UserType } from "../Schema/schema";
import User from "../Model/User";
import Blog from "../Model/Blog";
import Comment from "../Model/Comment";

import { Document, startSession } from "mongoose";
import { hashSync, compareSync } from "bcryptjs";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    users: {
      type: GraphQLList(UserType),
      async resolve() {
        return await User.find();
      },
    },

    // Blogging Api
    Blog: {
      type: GraphQLList(BlogType),
      async resolve() {
        return await Blog.find();
      },
    },
    comment: {
      type: GraphQLList(CommentType),
      async resolve() {
        return await Comment.find();
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutaion",
  fields: {
    SignUp: {
      type: UserType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(paraent, { name, email, password }) {
        let existinguser = Document<any, any, any>;
        try {
          existinguser = await User.findOne({ email });
          if (existinguser) return new Error("user is already exist");
          const encryptpassword = hashSync(password);
          const user = new User({ name, email, password: encryptpassword });
          return await user.save();
        } catch (err) {
          return new Error("user Sign Up Fail");
        }
      },
    },
    Login: {
      type: UserType,
      args: {
        password: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      async resolve(paraent, { email, password }) {
        let existingUser = Document<any, any, any>;
        try {
          existingUser = await User.findOne({ email });
          if (!existingUser)
            return new Error("the user does not exist with this email");

          const decycpta = compareSync(
            password,
            // @ts-ignore
            existingUser?.password,
          );

          if (!decycpta) return new Error("the password does not match");
          return existingUser;
        } catch (error) {
          return new Error(error);
        }
      },
    },
    // Add Blog
    addblog: {
      type: BlogType,
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
        date: { type: GraphQLNonNull(GraphQLString) },
        user: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, { title, content, date, user }) {
        let blog: Document<any, any, any>;

        const session = await startSession();

        try {
          session.startTransaction({ session });
          blog = new Blog({ title, content, date, user });
          const existinguser = await User.findById(user);
          if (!existinguser) return new Error("the user Does Not Exist");
          //@ts-ignore
          existinguser.blogs.push(blog);

          await existinguser.save({ session });
          await blog.save({ session });
          return blog;
        } catch (err) {
          return new Error(err);
        } finally {
          await session.commitTransaction();
        }
      },
    },
    addcomment: {
      type: CommentType,
      args: {
        blog: { type: GraphQLNonNull(GraphQLID) },
        user: { type: GraphQLNonNull(GraphQLID) },
        text: { type: GraphQLNonNull(GraphQLString) },
        date: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { user, blog, text, date }) {
        const session = await startSession();
        let comment: Document<any, any, any>;
        try {
          session.startTransaction({ session });
          const existingUser = await User.findById(user);
          const existingBlog = await Blog.findById(blog);
          if (!existingBlog || !existingUser)
            return new Error("User Or Blog Does Not Exist");

          comment = new Comment({
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
        } catch (err) {
          return new Error(err);
        } finally {
          await session.commitTransaction();
        }
      },
    },

    // Update Blog
    updateblog: {
      type: BlogType,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(paraent, { id, title, content }) {
        let blog: Document<any, any, any>;
        try {
          blog = await Blog.findById(id);
          if (!blog) return new Error("the id does not exist");
          return await Blog.findByIdAndUpdate(
            id,
            {
              title,
              content,
            },
            { new: true },
          );
        } catch (error) {
          return new Error(error);
        }
      },
    },
    // Delete the Blog
    DeleteBlog: {
      type: BlogType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      async resolve(paraent, { id }) {
        let existingblog: Document<any, any, any>;
        const session = await startSession();
        try {
          session.startTransaction({ session });
          existingblog = await Blog.findById(id).populate("user");
          // @ts-ignore
          const existinguser = existingblog.user;
          if (!existinguser) return new Error("No User Linked to this blog");
          if (!existingblog) return new Error("the blog not exist");
          existinguser.blogs.pull(existingblog);
          existinguser.save({ session });
          return await existinguser.remove({ session });
        } catch (error) {
          return new Error(error);
        } finally {
          session.commitTransaction();
        }
      },
    },
    // Delete Comment

    deletecomment: {
      type: CommentType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, { id }) {
        let comment = Document<AnalyserNode, any, any>;
        const session = await startSession();
        try {
          session.startTransaction({ session });
          comment = await Comment.findById(id);
          if (!comment) return new Error("Comment NOt Found");
          // @ts-ignore
          const existingUser = await User.findById(comment?.user);
          if (!existingUser) return new Error("User Not Find");
          // @ts-ignore
          const existingBlog = await Blog.findById(comment?.blog);
          if (!existingBlog) return new Error("Blog Not Found");
          // @ts-ignore
          existingUser.comments.pull(id);
          // @ts-ignore
          existingBlog.comments.pull(id);

          await existingBlog.save({ session });
          await existingUser.save({ session });

          // @ts-ignore
          return await Comment.findByIdAndDelete(id);
        } catch (error) {
          return new Error(error);
        } finally {
          await session.commitTransaction();
        }
      },
    },
  },
});

export default new GraphQLSchema({ query: RootQuery, mutation: Mutation });
