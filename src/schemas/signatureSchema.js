import joi from 'joi';

const signatureSchema = joi.object({
  name: joi.string().min(2).max(75).required(),
  signatureType: joi.string().required(),
  deliveryDay: joi.string().required(),
  tea: joi.boolean().required(),
  organicProducts: joi.boolean().required(),
  incense: joi.boolean().required(),
  address: joi.string().required(),
  cep: joi.number().min(10000000).max(99999999),
  city: joi.string().required(),
  state: joi.string().min(2).max(2).required(),
});

export default signatureSchema;
