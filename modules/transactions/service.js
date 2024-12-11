
import httpResponse from "../../helpers/http_responses/index.js";
import exceptions from "../../helpers/utils/exceptions.js";
import logger from "../../helpers/utils/logger.js";

class TransactionService {
  constructor(repo) {
    this.ctx = this.constructor.name;
    this.repo = repo;
  };

  getUserBalance = async (userId) => {
    const ctx = `${this.ctx}.getUserBalance`;

    const userBalance = await this.repo.getUserBalance(userId);
    if (userBalance.error) {
      if (userBalance.exception == exceptions.NOT_FOUND) {
        return new httpResponse.NotFound().setMessage("Data tidak ditemukan");
      }

      logger.log(ctx, userBalance.message, "this.repo.getServices()");
      return new httpResponse.InternalServerError().setMessage("Terjadi kesalahan pada server");
    }

    const response = {
      balance: parseInt(userBalance.items.balance)
    }

    return new httpResponse.OK().setData(response).setMessage("Sukses");
  };

  topUpUserBalance = async (userId, payload) => {
    const ctx = `${this.ctx}.topUpUserBalance`;

    const topUp = await this.repo.topUpUserBalance(userId, payload.top_up_amount);
    if (topUp.error) {
      if (topUp.exception == exceptions.NOT_FOUND) {
        return new httpResponse.NotFound().setMessage("Data tidak ditemukan");
      }

      logger.log(ctx, topUp.message, "this.repo.topUpUserBalance()");
      return new httpResponse.InternalServerError().setMessage("Terjadi kesalahan pada server");
    }

    const response = {
      balance: parseInt(topUp.items)
    }

    return new httpResponse.OK().setData(response).setMessage("Sukses");
  }
}

export default TransactionService;