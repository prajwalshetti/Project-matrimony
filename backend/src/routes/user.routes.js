import express from "express"
import { app } from "../app.js"
import { loginuser, register,logoutuser, getAllUsers, getUserById, updateUser,getLoggedinUser, uploadProfilePhoto} from "../controllers/user.controller.js"
import { asyncHandler } from "../utils/asynchandler.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { isProfileCompleted } from "../middlewares/ProfileCompletion.middleware.js"
const router=express()

router.route("/register").post(register)
router.route("/loginuser").post(loginuser)
router.route("/logoutuser").post(verifyJWT,logoutuser)
router.route("/getAllUsers").get(getAllUsers)
router.route("/getUserById/:id").get(getUserById)

router.route("/updateUser").put(verifyJWT, updateUser)
router.route("/getLoggedinUser").get(verifyJWT, getLoggedinUser)
router.post("/uploadProfilePhoto", verifyJWT, upload.single("profilePhoto"), uploadProfilePhoto);


router.route("/checkForVerifyJWT").get(verifyJWT,async (req, res) => {
    return res.status(200).json({
        message: "You have access to this protected route!",
        user: req.user, // The authenticated user data will be available here
    });
})

router.route("/testProfileCompletion").get(verifyJWT, isProfileCompleted, async (req, res) => {
    return res.status(200).json({
        message: "Profile completion check successful!",
        profileCompletion: req.profileCompletion
    });
})

export default router