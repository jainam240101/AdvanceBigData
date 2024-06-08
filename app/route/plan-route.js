const express = require("express");
const planController = require("../controller/plan-controller.js");

const planRouter = express.Router();

planRouter.get('/:planId', planController.getPlanById);
planRouter.post('', planController.createPlan);
planRouter.delete('/:planId', planController.deletePlan );

module.exports = planRouter;