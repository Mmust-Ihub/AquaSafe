import AfricasTalkingSMS from "../lib/africastalking.js"
const options = {
    to: ['+254702862396', '+254112026317'],
    message: "I'm Testing the api"
}


export async function SendSMS(req, res, next){
    try{
        const resp = await AfricasTalkingSMS.send(options);
        console.dir(resp.SMSMessageData.Recipients)
        res.status(500).json({message: "check your phone for SMS"});
    
    } catch (err){
        console.log(err);
        next()
    }
}