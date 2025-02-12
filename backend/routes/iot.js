import { Router } from "express";
const router = Router()


router.get("/", (req,res)=>{
    res.status(200).send("coming soon...")
})

// Check Cage Validity
router.post("/data", )
// phosphorus=0.1 max
// Oxygen = min 5
// nitrogen = 0.1 max
export default router;