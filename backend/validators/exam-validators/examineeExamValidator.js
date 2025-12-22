const Joi = require("joi");

// =================== Create Examinee Exam Schema ===================
const createExamineeExamSchema = Joi.object({
  examinee_ids: Joi.array()
    .items(Joi.string().guid({ version: "uuidv4" }))
    .min(1)
    .required()
    .messages({
      "array.base": "Examinee IDs must be an array.",
      "array.min": "At least one examinee ID is required.",
      "any.required": "Examinee IDs are required.",
      "string.guid": "Each Examinee ID must be a valid UUID.",
    }),
  exam_id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.guid": "Exam ID must be a valid UUID.",
    "any.required": "Exam ID is required.",
  }),
  exam_schedule_id: Joi.string()
    .guid({ version: "uuidv4" })
    .required()
    .messages({
      "string.guid": "Schedule ID must be a valid UUID.",
      "any.required": "Schedule ID is required.",
    }),
  total_score: Joi.number().min(0).optional(),
  is_passed: Joi.boolean().optional(),
});

// =================== Update Examinee Exam Schema ===================
const updateExamineeExamSchema = Joi.object({
  total_score: Joi.number().min(0).optional(),
  exam_schedule_id: Joi.string().guid({ version: "uuidv4" }).optional(),
  is_passed: Joi.boolean().optional(),
});

// =================== Validators ===================
exports.validateCreateExamineeExam = (req, res, next) => {
  const { error } = createExamineeExamSchema.validate(req.body, {
    abortEarly: true,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

exports.validateUpdateExamineeExam = (req, res, next) => {
  const { error } = updateExamineeExamSchema.validate(req.body, {
    abortEarly: true,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};
