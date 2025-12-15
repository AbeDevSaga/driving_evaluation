const Joi = require("joi");

// =================== Create Exam Schema ===================
const createExamSchema = Joi.object({
  name: Joi.string().min(3).max(150).required().messages({
    "string.empty": "Exam name is required.",
    "string.min": "Exam name must be at least 3 characters long.",
    "string.max": "Exam name must not exceed 150 characters.",
  }),

  description: Joi.string().allow(null, "").optional(),

  pass_percentage: Joi.number().min(0).max(100).required().messages({
    "number.base": "Pass percentage must be a number.",
    "number.min": "Pass percentage cannot be less than 0.",
    "number.max": "Pass percentage cannot exceed 100.",
    "any.required": "Pass percentage is required.",
  }),
});

// =================== Update Exam Schema ===================
const updateExamSchema = Joi.object({
  name: Joi.string().min(3).max(150).optional(),
  description: Joi.string().allow(null, "").optional(),
  pass_percentage: Joi.number().min(0).max(100).optional(),
  is_active: Joi.boolean().optional(),
});

// =================== Validators ===================
exports.validateCreateExam = (req, res, next) => {
  const { error } = createExamSchema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

exports.validateUpdateExam = (req, res, next) => {
  const { error } = updateExamSchema.validate(req.body, {
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
