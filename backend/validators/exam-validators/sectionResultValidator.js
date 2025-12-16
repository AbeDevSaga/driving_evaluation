const Joi = require("joi");

const validateCreateSectionResult = (req, res, next) => {
  const schema = Joi.object({
    examinee_exam_id: Joi.string().uuid().required(),
    section_id: Joi.string().uuid().required(),
    examiner_id: Joi.string().uuid().required(),
    score: Joi.number().required(),
    remarks: Joi.string().optional().allow(""),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  next();
};

const validateUpdateSectionResult = (req, res, next) => {
  const schema = Joi.object({
    score: Joi.number().optional(),
    remarks: Joi.string().optional().allow(""),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  next();
};

module.exports = {
  validateCreateSectionResult,
  validateUpdateSectionResult,
};
