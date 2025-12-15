const Joi = require("joi");

// =================== Create Vehicle Category Schema ===================
const createVehicleCategorySchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Vehicle category name is required.",
    "string.min": "Vehicle category name must be at least 3 characters long.",
    "string.max": "Vehicle category name must not exceed 100 characters.",
    "any.required": "Vehicle category name is required.",
  }),

  description: Joi.string().allow(null, "").optional(),
});

// =================== Update Vehicle Category Schema ===================
const updateVehicleCategorySchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().allow(null, "").optional(),
  is_active: Joi.boolean().optional(),
});

// =================== Validators ===================
exports.validateCreateVehicleCategory = (req, res, next) => {
  const { error } = createVehicleCategorySchema.validate(req.body, {
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

exports.validateUpdateVehicleCategory = (req, res, next) => {
  const { error } = updateVehicleCategorySchema.validate(req.body, {
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
