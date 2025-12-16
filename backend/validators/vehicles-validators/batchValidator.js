const Joi = require("joi");

// =================== Create Batch Schema ===================
const createBatchSchema = Joi.object({
  vehicle_category_id: Joi.string()
    .guid({ version: "uuidv4" })
    .required()
    .messages({
      "string.guid": "Vehicle category ID must be a valid UUID.",
      "string.empty": "Vehicle category ID is required.",
      "any.required": "Vehicle category ID is required.",
    }),

  batch_code: Joi.string().max(50).required().messages({
    "string.empty": "Batch code is required.",
    "string.max": "Batch code must not exceed 50 characters.",
    "any.required": "Batch code is required.",
  }),

  name: Joi.string().min(3).max(150).required().messages({
    "string.empty": "Batch name is required.",
    "string.min": "Batch name must be at least 3 characters long.",
    "string.max": "Batch name must not exceed 150 characters.",
    "any.required": "Batch name is required.",
  }),

  year: Joi.number().integer().min(2000).required().messages({
    "number.base": "Batch year must be a number.",
    "number.min": "Batch year must be greater than or equal to 2000.",
    "any.required": "Batch year is required.",
  }),
});

// =================== Update Batch Schema ===================
const updateBatchSchema = Joi.object({
  batch_code: Joi.string().max(50).optional().messages({
    "string.max": "Batch code must not exceed 50 characters.",
  }),

  name: Joi.string().min(3).max(150).optional().messages({
    "string.min": "Batch name must be at least 3 characters long.",
    "string.max": "Batch name must not exceed 150 characters.",
  }),

  year: Joi.number().integer().min(2000).optional().messages({
    "number.base": "Batch year must be a number.",
    "number.min": "Batch year must be greater than or equal to 2000.",
  }),

  is_active: Joi.boolean().optional(),
});

// =================== Validators ===================
exports.validateCreateBatch = (req, res, next) => {
  const { error } = createBatchSchema.validate(req.body, {
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

exports.validateUpdateBatch = (req, res, next) => {
  const { error } = updateBatchSchema.validate(req.body, {
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
