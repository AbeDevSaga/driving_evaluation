const Joi = require("joi");

// =================== Create Exam Schedule Schema ===================
const createExamScheduleSchema = Joi.object({
  exam_id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.guid": "Exam ID must be a valid UUID.",
    "any.required": "Exam ID is required.",
    "string.empty": "Exam ID is required.",
  }),

  exam_date: Joi.date().required().messages({
    "date.base": "Exam date must be a valid date.",
    "any.required": "Exam date is required.",
  }),

  location: Joi.string().max(150).allow(null, "").optional().messages({
    "string.max": "Location must not exceed 150 characters.",
  }),
});

// =================== Update Exam Schedule Schema ===================
const updateExamScheduleSchema = Joi.object({
  exam_date: Joi.date().optional().messages({
    "date.base": "Exam date must be a valid date.",
  }),

  location: Joi.string().max(150).allow(null, "").optional().messages({
    "string.max": "Location must not exceed 150 characters.",
  }),
});

// =================== Validators ===================
exports.validateCreateExamSchedule = (req, res, next) => {
  const { error } = createExamScheduleSchema.validate(req.body, {
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

exports.validateUpdateExamSchedule = (req, res, next) => {
  const { error } = updateExamScheduleSchema.validate(req.body, {
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
