
import httpResponse from "../../helpers/http_responses/index.js";
import exceptions from "../../helpers/utils/exceptions.js";
import logger from "../../helpers/utils/logger.js";

class TransactionService {
  constructor(repo, serviceRepo) {
    this.ctx = this.constructor.name;
    this.repo = repo;
    this.serviceRepo = serviceRepo;
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

  userTransaction = async (userId, payload) => {
    const ctx = `${this.ctx}.userTransaction`;

    const service = await this.serviceRepo.getServiceByCode(payload.service_code);
    if (service.error) {
      if (service.exception == exceptions.NOT_FOUND) {
        return new httpResponse.NotFound().setMessage("Service ataus Layanan tidak ditemukan");
      }

      logger.log(ctx, service.message, "this.repo.getServiceByCode");
      return new httpResponse.InternalServerError().setMessage("Terjadi kesalahan pada server");
    }

    const userBalance = await this.repo.getUserBalance(userId);
    if (userBalance.error) {
      if (userBalance.exception == exceptions.NOT_FOUND) {
        return new httpResponse.NotFound().setMessage("Data tidak ditemukan");
      }

      logger.log(ctx, userBalance.message, "this.repo.getServiceByCode");
      return new httpResponse.InternalServerError().setMessage("Terjadi kesalahan pada server");
    }

    const balance = parseFloat(userBalance.items.balance);
    const servicePrice = parseFloat(service.items.price);
    if (balance < servicePrice) {
      return new httpResponse.Forbidden().setMessage("Saldo tidak cukup");
    }

    const newBalance = balance - servicePrice;
    const payloadTransaction = {
      userId: userId,
      balance: newBalance,
      transaction: {
        invoiceNumber: `INV-${userId}-${new Date().getTime()}`,
        type: 'PAYMENT',
        amount: servicePrice,
        description: service.items.name,
        createdOn: new Date()
      }
    };

    const transaction = await this.repo.userTransaction(payloadTransaction);
    if (transaction.error) {
      logger.log(ctx, transaction.message, "this.repo.userTransaction");
      return new httpResponse.InternalServerError().setMessage("Terjadi kesalahan pada server");
    }

    const response = {
      invoice_number: payloadTransaction.transaction.invoiceNumber,
      service_code: service.items.code,
      service_name: service.items.name,
      transaction_type: payloadTransaction.transaction.type,
      total_amount: servicePrice,
      created_on: payloadTransaction.transaction.createdOn
    };

    return new httpResponse.OK().setData(response).setMessage("Transaksi berhasil");
  };

  getUserTransactionHistory = async (userId, queryParams) => {
    const ctx = `${this.ctx}.getUserTransactionHistory`;

    const limit = parseInt(queryParams.limit);
    const offset = (parseInt(queryParams.offset) - 1) * limit;

    const transactionHistory = await this.repo.getUserTransactionHistory(userId, limit, offset);
    if (transactionHistory.error) {
      if (transactionHistory.exception == exceptions.NOT_FOUND) {
        return new httpResponse.NotFound().setMessage("Data tidak ditemukan");
      }

      logger.log(ctx, transactionHistory.message, "this.repo.getUserTransactionHistory");
      return new httpResponse.InternalServerError().setMessage("Terjadi kesalahan pada server");
    }

    const response = {
      offset: offset + 1,
      limit: limit,
      records: transactionHistory.items.map(item => {
        return {
          invoice_number: item.invoice_number,
          transaction_type: item.transaction_type,
          description: item.description,
          total_amount: parseFloat(item.total_amount),
          created_on: item.created_on
        }
      })
    }

    return new httpResponse.OK().setData(response).setMessage("Get History Berhasil");
  }
}

export default TransactionService;