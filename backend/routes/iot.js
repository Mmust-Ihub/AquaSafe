import { Router } from "express";
import AddData from "../contollers/adddata.js";
import ValidateData from "../middlewares/validateData.js";
import ValidateCageId from "../middlewares/validateid.js";
const router = Router()


router.get("/", (req,res)=>{
    res.status(200).send("coming soon...")
})

// Check Cage Validity
<<<<<<< HEAD
router.post("/data",ValidateData,ValidateCageId, AddData);

=======
router.post("/data", )
// phosphorus=0.1 max
// Oxygen = min 5
// nitrogen = 0.1 max
>>>>>>> ca267e8cf5be6300f7ab768eaf2f25ab1fe77bae
export default router;