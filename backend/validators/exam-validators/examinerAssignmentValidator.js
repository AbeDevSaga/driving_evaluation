"use strict";

const Joi = require("joi");

const createExaminerAssignmentSchema = Joi.object({
  examiner_id: Joi.string().uuid().required(),
  section_id: Joi.string().uuid().required(),
  exam_schedule_id: Joi.string().uuid().required(),
});

const updateExaminerAssignmentSchema = Joi.object({
  examiner_id: Joi.string().uuid(),
  section_id: Joi.string().uuid(),
  exam_schedule_id: Joi.string().uuid(),
});

const validateCreateExaminerAssignment = (req, res, next) => {
  const { error } = createExaminerAssignmentSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

const validateUpdateExaminerAssignment = (req, res, next) => {
  const { error } = updateExaminerAssignmentSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCreateExaminerAssignment,
  validateUpdateExaminerAssignment,
};
