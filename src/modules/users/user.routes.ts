import { Router } from "express";
import { validateResources } from "../../middlewares/validate-resources";
import { createUserSchema } from "./schemas/create-user-schema";
import { createUserHandler } from "./user.handler";

const router = Router();

router.post("/users", validateResources(createUserSchema), createUserHandler);

export default router;
