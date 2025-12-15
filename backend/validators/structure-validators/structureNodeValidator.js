const Joi = require("joi");
const { validate: isUuid } = require("uuid");

// =================== Create Structure Node Schema ===================
const createStructureNodeSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    "string.empty": "Structure node name is required.",
    "string.min": "Structure node name must be at least 3 characters long.",
    "string.max": "Structure node name must not exceed 255 characters.",
  }),

  description: Joi.string().allow(null, "").optional(),

  parent_id: Joi.string()
    .allow(null, "")
    .custom((value, helpers) => {
      if (value && !isUuid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "UUID validation")
    .messages({
      "any.invalid": "Parent ID must be a valid UUID.",
    }),

  level: Joi.number().integer().min(1).optional().messages({
    "number.base": "Level must be a number.",
    "number.min": "Level cannot be less than 1.",
  }),
});

// =================== Update Structure Node Schema ===================
const updateStructureNodeSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  description: Joi.string().allow(null, "").optional(),
  parent_id: Joi.string()
    .allow(null, "")
    .custom((value, helpers) => {
      if (value && !isUuid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "UUID validation")
    .optional()
    .messages({
      "any.invalid": "Parent ID must be a valid UUID.",
    }),
  level: Joi.number().integer().min(1).optional(),
  is_active: Joi.boolean().optional(),
});

// =================== Validators ===================
exports.validateCreateStructureNode = (req, res, next) => {
  const { error } = createStructureNodeSchema.validate(req.body, {
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

exports.validateUpdateStructureNode = (req, res, next) => {
  const { error } = updateStructureNodeSchema.validate(req.body, {
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
