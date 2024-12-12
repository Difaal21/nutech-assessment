import exceptions from "../../helpers/utils/exceptions.js";
import logger from "../../helpers/utils/logger.js";
import wrapper from "../../helpers/utils/wrapper.js";

class TransactionRepository {
  constructor(db) {
    this.db = db;
    this.ctx = this.constructor.name;
  }

  getUserBalance = async (userId) => {
    const ctx = `${this.ctx}.getUserBalance`;
    const conn = await this.db.getConnection();
    try {
      let query = `SELECT id, user_id, balance FROM users_balance WHERE user_id = ?`;

      const [results] = await conn.query(query, [userId]);
      if (results.length == 0) {
        return wrapper.error({ exception: exceptions.NOT_FOUND });
      }
      return wrapper.data({ items: results[0] });
    } catch (error) {
      logger.log(ctx, error, "getUserBalance");
      return wrapper.error({ message: error.message, items: error });
    } finally {
      conn.release();
    }
  }

  topUpUserBalance = async (userId, amount) => {
    const ctx = `${this.ctx}.topUpUserBalance`;
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();

      let selectBalanceQuery = `SELECT balance FROM users_balance WHERE user_id = ? FOR UPDATE`;
      const [results] = await conn.query(selectBalanceQuery, [userId]);
      if (results.length == 0) {
        await conn.rollback();
        logger.log(ctx, "User not found", "conn.query");
        return wrapper.error({ exception: exceptions.NOT_FOUND });
      }

      const currentBalance = parseFloat(results[0].balance);
      const newBalance = currentBalance + parseFloat(amount);

      let updateBalanceQuery = `UPDATE users_balance SET balance = ? WHERE user_id = ?`;
      await conn.query(updateBalanceQuery, [newBalance, userId]);

      let insertTransactionQuery = `INSERT INTO transactions (invoice_number, user_id, transaction_type, description, total_amount, created_on) VALUES (?, ?, ?, ?, ?, ?)`;
      const invoiceNumber = `INV-${userId}-${new Date().getTime()}`;
      const transactionType = 'TOPUP';
      const description = 'Top Up balance';
      const createdOn = new Date();
      await conn.query(insertTransactionQuery, [invoiceNumber, userId, transactionType, description, amount, createdOn]);

      await conn.commit();
      return wrapper.data({ message: 'Balance updated successfully', items: newBalance });
    } catch (error) {
      await conn.rollback();
      logger.log(ctx, error, "topUpUserBalance");
      return wrapper.error({ message: error.message, items: error });
    } finally {
      conn.release();
    }
  }
};


export default TransactionRepository;