import express from "express"
import {config} from "dotenv"
import { connectToDatabase } from "./utils/connect";
import { graphqlHTTP } from "express-graphql";
import schema from "./handler/handler"

config();
const app = express();

app.use("/graphql",graphqlHTTP({schema:schema,graphiql:true}))

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema: yourGraphQLSchema,
  graphiql: true,
}));

connectToDatabase().then(()=>{
    app.listen(process.env.PORT,()=>console.log(`server is running ${process.env.PORT}`));
}).catch((err)=>console.log(err))


