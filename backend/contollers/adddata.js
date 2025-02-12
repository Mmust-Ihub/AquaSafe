import { db } from "../lib/firebase.js";
import sendEmail from "../middlewares/sendEmail.js";


export default async function AddData(req, res){
    const {nitrogen, phosphorus, oxygen, id, location, temp} = req.body;
    console.log(req.body)
    console.log(req.user)
    const cageRef = db.collection("cages").doc(id);
    const data =  await cageRef.update({nitrogen,oxygen,phosphorus,temp,location})
    console.log(data);
    if (nitrogen > 0.1 || oxygen < 5 || (temp > 37 && temp > 23) || phosphorus > 0.1){
        try{
        const userRef = await db.collection("users").doc(req.user).get();
        console.log(userRef.data() ,"user...");
        res.status(202).json({
            move: {
                latitude:  -0.180472,
                longitude: 34.747611
            }
        })
        return sendEmail(userRef.data().email, req.body);
        } catch(err){
            console.log(err)
            res.status(500).json({error: "An error occured try again"})
        }
        

    }
  
    res.status(200).json({message: "Recieved successfully"});
    return;
    
}