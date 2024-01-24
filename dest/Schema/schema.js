"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentType = exports.BlogType = exports.UserType = void 0;
const graphql_1 = require("graphql");
exports.UserType = new graphql_1.GraphQLObjectType({
    name: "UserType",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString }
    })
});
exports.BlogType = new graphql_1.GraphQLObjectType({
    name: "BlogType",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
        title: { type: graphql_1.GraphQLString },
        content: { type: graphql_1.GraphQLString },
        date: { type: graphql_1.GraphQLString }
    })
});
exports.CommentType = new graphql_1.GraphQLObjectType({
    name: "CommentType",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
        text: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        date: { type: graphql_1.GraphQLString }
    })
});
//# sourceMappingURL=schema.js.map