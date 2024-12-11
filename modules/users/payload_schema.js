import joi from 'joi';

const registration = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  password: joi.string().min(8).required(),
  email: joi.string().email().message("Parameter email tidak sesuai format").required(),
});

const login = joi.object({
  email: joi.string().email().message("Parameter email tidak sesuai format").required(),
  password: joi.string().min(8).required(),
});

const updateProfile = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(),
});
const uploadProfileImage = joi.object({
  fieldname: joi.string().required(),
  mimetype: joi.string().valid('image/png', 'image/jpeg').required(),
  originalname: joi.string().required(),
  encoding: joi.string().required(),
  size: joi.number().required(),

  // buffer: joi.binary().required(),
  path: joi.string().required(),
  filename: joi.string().required(),
  destination: joi.string().required(),
});

export default { login, registration, updateProfile, uploadProfileImage };