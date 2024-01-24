"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const connect_1 = require("./utils/connect");
const express_graphql_1 = require("express-graphql");
const handler_1 = __importDefault(require("./handler/handler"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({ schema: handler_1.default, graphiql: true }));
(0, connect_1.connectToDatabase)().then(() => {
    app.listen(process.env.PORT, () => console.log(`server is running ${process.env.PORT}`));
}).catch((err) => console.log(err));
//# sourceMappingURL=app.js.map