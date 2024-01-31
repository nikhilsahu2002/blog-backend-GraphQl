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
const cors_1 = __importDefault(require("cors")); // Import the cors middleware
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Enable CORS
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({ schema: handler_1.default, graphiql: true }));
(0, connect_1.connectToDatabase)()
    .then(() => {
    app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
})
    .catch((err) => console.log(err));
//# sourceMappingURL=app.js.map