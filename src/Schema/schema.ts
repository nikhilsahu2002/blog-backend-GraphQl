import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import Blog from "../Model/Blog";
import Comment from "../Model/Comment";
import User from "../Model/User";

export const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    blogs: {
      type: GraphQLList(BlogType),
      async resolve(parent) {
        return await Blog.find({ user: parent.id });
      },
    },
    comment: {
      type: GraphQLList(CommentType),
      async resolve(parent) {
        return await Comment.find({ user: parent.id });
      },
    },
  }),
});

export const BlogType = new GraphQLObjectType({
  name: "BlogType",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    date: { type: GraphQLString },
    user: {
      type: UserType,
      async resolve(parent) {
        return await User.findById(parent.user);
      },
    },
    comment: {
      type: GraphQLList(CommentType),
      async resolve(parent) {
        return await Comment.find({ blog: parent.id });
      },
    },
  }),
});

export const CommentType = new GraphQLObjectType({
  name: "CommentType",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    text: { type: GraphQLNonNull(GraphQLString) },
    date: { type: GraphQLString },
    user: {
      type: UserType,
      async resolve(parent) {
        return await User.findById(parent.user);
      },
    },
    blog: {
      type: BlogType,
      async resolve(parent) {
        return await Blog.findById(parent.blog);
      },
    },
  }),
});
