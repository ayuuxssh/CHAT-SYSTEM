import express  from "express";
const router = express.Router();
import { getAllContacts,getMessageByUserId ,sendMessage,getChartPartners} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
//some api endpoints
 
router.use(arcjetProtection,protectRoute);


router.get("/contacts",getAllContacts);
router.get("/chats",getChartPartners);

router.get("/:id",getMessageByUserId);


router.post("/send/:id",sendMessage);

export default router;