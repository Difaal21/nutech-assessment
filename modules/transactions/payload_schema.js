import joi from 'joi';

const topUpUserBalance = joi.object({
  top_up_amount: joi.number().greater(0).required().messages({
    'number.any': 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
    'number.greater': 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0'
  })
});

const userTransaction = joi.object({
  service_code: joi.string().required()
});

const getUserTransactionHistory = joi.object({
  limit: joi.number().integer().min(1).optional(),
  offset: joi.number().integer().min(1).optional()
}).with('limit', 'offset').with('offset', 'limit');


export default { topUpUserBalance, userTransaction, getUserTransactionHistory }