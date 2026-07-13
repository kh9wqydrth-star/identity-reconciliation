import {Router} from "express"

const router=Router()
router.post("/identify",(req,res)=>{
    res.json({
        message:"Identify endpoint working "
    })
})

export default router ;