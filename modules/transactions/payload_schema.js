import joi from 'joi';

const topUpUserBalance = joi.object({
  top_up_amount: joi.number().greater(0).required().messages({
    'number.any': 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
    'number.greater': 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0'
  })
});

export default { topUpUserBalance }