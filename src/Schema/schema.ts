import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"

export const UserType = new GraphQLObjectType({
    name:"UserType",
    fields:()=>({
        id : {type:GraphQLNonNull(GraphQLID)},
        name : {type:GraphQLString},
        email : {type : GraphQLString},
        password : {type : GraphQLString}
    })

})

export const BlogType = new GraphQLObjectType({
    name:"BlogType",
    fields : ()=>({
        id : {type:GraphQLNonNull(GraphQLID)},
        title : {type :GraphQLString},
        content : {type : GraphQLString},
        date : {type:GraphQLString}
    })
})

export const CommentType = new GraphQLObjectType({
    name : "CommentType",
    fields: ()=>({
        id : {type :GraphQLNonNull(GraphQLID)},
        text : {type : GraphQLNonNull(GraphQLString)},
        date : {type:GraphQLString}
        
    })
})