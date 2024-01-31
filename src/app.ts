import express from "express";
import { config } from "dotenv";
import { connectToDatabase } from "./utils/connect";
import { graphqlHTTP } from "express-graphql";
import schema from "./handler/handler";
import cors from "cors"; // Import the cors middleware

config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Use the graphqlHTTP middleware
app.use("/graphql", graphqlHTTP({ schema: schema, graphiql: true }));

connectToDatabase().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server is running on port ${process.env.PORT}`)
  );
}).catch((err) => console.log(err));
