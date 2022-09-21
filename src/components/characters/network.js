import { Router } from "express";
import * as Controller from "./controller";

const testRouter = Router();

testRouter.route("/").get(Controller.findAll);
testRouter.route("/:id").get(Controller.detail);
testRouter.route("/").post(Controller.create);
testRouter.route("/:id").put(Controller.update);
testRouter.route("/:id").delete(Controller.deleteById);


export default testRouter;