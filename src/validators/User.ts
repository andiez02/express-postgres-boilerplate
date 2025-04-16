import { Joi } from 'express-validation';

export default {
  getSuggestion: {
    query: Joi.object({
      searchKey: Joi.string().required().allow(null),
    }),
  },
};
