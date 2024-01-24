import { connect } from 'mongoose'

export const connectToDatabase =async () =>{
    try{
        await connect(process.env.MONGODB_URL)
    }catch(err){
        console.log(err);
    }
}
