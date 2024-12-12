import validator from "../../helpers/utils/validator.js";
import payloadSchema from "./payload_schema.js";
import httpResponse from "../../helpers/http_responses/index.js";

class TransactionHttpHandler {
  constructor(service) {
    this.service = service;
  }

  getUserBalance = async (req, res) => {
    const { userId } = req;
    const result = await this.service.getUserBalance(userId);
    return result.send(res);
  }

  topUpUserBalance = async (req, res) => {
    const { userId } = req;
    const payload = req.body;

    const validatePayload = validator.isValid(payload, payloadSchema.topUpUserBalance);
    if (validatePayload.error) {
      return new httpResponse.BadRequest().setMessage(validatePayload.items[0].message).send(res);
    };

    const result = await this.service.topUpUserBalance(userId, payload);
    return result.send(res);
  }

  userTransaction = async (req, res) => {
    const { userId } = req;
    const payload = req.body;

    const validatePayload = validator.isValid(payload, payloadSchema.userTransaction);
    if (validatePayload.error) {
      return new httpResponse.BadRequest().setMessage(validatePayload.items[0].message).send(res);
    };

    const result = await this.service.userTransaction(userId, payload);
    return result.send(res);
  }
}


export default TransactionHttpHandler;