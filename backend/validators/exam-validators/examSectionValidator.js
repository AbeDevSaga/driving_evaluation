const Joi = require("joi");

// =================== Create Exam Section Schema ===================
const createExamSectionSchema = Joi.object({
  exam_id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.guid": "Exam ID must be a valid UUID.",
    "any.required": "Exam ID is required.",
  }),
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Section name is required.",
    "string.min": "Section name must be at least 3 characters long.",
    "string.max": "Section name must not exceed 100 characters.",
  }),
  weight_percentage: Joi.number().min(0).max(100).required().messages({
    "number.base": "Weight percentage must be a number.",
    "number.min": "Weight percentage cannot be less than 0.",
    "number.max": "Weight percentage cannot exceed 100.",
    "any.required": "Weight percentage is required.",
  }),
  max_score: Joi.number().min(0).optional().messages({
    "number.base": "Max score must be a number.",
    "number.min": "Max score cannot be less than 0.",
  }),
});

// =================== Update Exam Section Schema ===================
const updateExamSectionSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  weight_percentage: Joi.number().min(0).max(100).optional(),
  max_score: Joi.number().min(0).optional(),
});

// =================== Validators ===================
exports.validateCreateSection = (req, res, next) => {
  const { error } = createExamSectionSchema.validate(req.body, {
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

exports.validateUpdateSection = (req, res, next) => {
  const { error } = updateExamSectionSchema.validate(req.body, {
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
