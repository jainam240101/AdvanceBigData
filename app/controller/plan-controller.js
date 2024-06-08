const express = require("express");
const router = express.Router();
const schemaValidation = require("../validations/schemaValidation.js");
const redisService = require("../services/redis-service.js");

const planController = {};

planController.getPlanById = async (req, res, next) => {
  const planObjId = req.params.planId;
  console.log(planObjId);
  if (planObjId == null && planObjId == "" && req.params == {}) {
    return res.status(400).json({ error: "appropriate plan id required" });
  }

  const getPlan = await redisService.findEntry(req.params.planId);

  if (getPlan.objectId == planObjId) {
    if (
      req.headers["if-none-match"] &&
      getPlan.ETag == req.headers["if-none-match"]
    ) {
      console.log(JSON.parse(getPlan.plan));
      res.setHeader("ETag", getPlan.ETag);
      return res.status(304).json({
        message: "Unmodified Plan",
        plan: JSON.parse(getPlan.plan),
      });
    } else {
      console.log(JSON.parse(getPlan.plan));
      res.setHeader("ETag", getPlan.ETag);
      return res.status(200).json(JSON.parse(getPlan.plan));
    }
  } else {
    return res.status(404).json({ message: "Plan Not Found" });
  }
};

planController.createPlan = async (req, res, next) => {
  const planObjId = req.body.objectId;

  if (schemaValidation.validator(req.body)) {
    const getPlan = await redisService.findEntry(planObjId);
    console.log(getPlan);
    if (getPlan) {
      res.setHeader("ETag", getPlan.ETag);
      return res.status(409).json({ error: "Existing Plan found" });
    } else {
      const ETag = (await redisService.addPlanFromReq(req.body)).ETag;
      res.setHeader("ETag", ETag);
      return res.status(201).json({
        success: "New Plan created",
        planObjId,
        ETag: ETag,
      });
    }
  } else {
    return res.status(400).json({ error: "Incorrect Plan" });
  }
};

planController.deletePlan = async (req, res) => {
  const planObjId = req.params.planId;
  if (planObjId == null && planObjId == "" && req.params == {}) {
    return res.status(400).json({ error: "invalid plan ID" });
  }
  const getPlan = await redisService.findEntry(planObjId);
  if (getPlan.objectId == req.params.planId) {
    console.log(JSON.parse(getPlan.plan));
    if (redisService.deletePlan(req.params)) {
      console.log("Deleted the plan");
      res.status(200).json({ success: "Plan deleted successfully" });
    } else {
      console.log("Cannot delete Plan");
      res.status(500).json({ error: "Cannot delete Plan" });
    }
    return;
  } else {
    return res.status(404).json({ error: "Plan Not Found" });
  }
};

module.exports = planController;
