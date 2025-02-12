import { db } from "../lib/firebase.js";
import sendEmail from "../middlewares/sendEmail.js";


export default async function AddData(req, res){
    // phosphorus=0.1 max
// Oxygen = min 5
// nitrogen = 0.1 max
//temp == 37 max
    const {nitrogen, phosphorus, oxygen, id, location, temp} = req.body;
    console.log(req.body)
    console.log(req.user)
    if(nitrogen > 0.1 || oxygen < 5 || temp > 37 || phosphorus > 0.1 ){
        const userRef = await db.collection("users").doc(req.user).get();
        console.log(userRef.data() ,"user...");
        sendEmail(userRef.data().email, req.body);
    }
  
    res.status(200).json({message: "Recieved successfully"});
    
}