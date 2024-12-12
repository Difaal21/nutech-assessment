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
      logger.log(ctx, error.message, "topUpUserBalance");
      return wrapper.error({ message: error.message, items: error });
    } finally {
      conn.release();
    }
  }

  userTransaction = async (payload) => {
    const ctx = `${this.ctx}.userTransaction`;
    const conn = await this.db.getConnection();

    const { userId, balance, transaction } = payload;
    try {
      await conn.beginTransaction();
      let insertTransactionQuery = `INSERT INTO transactions (invoice_number, user_id, transaction_type, description, total_amount, created_on) VALUES (?, ?, ?, ?, ?, ?)`;
      await conn.query(insertTransactionQuery, [transaction.invoiceNumber, userId, transaction.type, transaction.description, transaction.amount, transaction.createdOn]);

      let updateBalanceQuery = `UPDATE users_balance SET balance = ? WHERE user_id = ?`;
      await conn.query(updateBalanceQuery, [balance, userId]);
      await conn.commit();
      return wrapper.data({});
    } catch (error) {
      await conn.rollback();
      logger.log(ctx, error.message, "userTransaction");
      return wrapper.error({ message: error.message });
    } finally {
      conn.release();
    }
  }

  getUserTransactionHistory = async (userId, limit, offset) => {
    const ctx = `${this.ctx}.getUserTransactionHistory`;
    const conn = await this.db.getConnection();

    try {
      let query = `
        SELECT t.id, t.invoice_number, t.user_id, t.transaction_type, t.description, t.total_amount, t.created_on
        FROM transactions t
        WHERE t.user_id = ?
        ORDER BY t.created_on DESC
      `;

      if (limit <= 1 && offset <= 0) {
        query += ` LIMIT ? OFFSET ?`;
      }

      const [results] = await conn.query(query, [userId, limit, offset]);
      if (results.length == 0) {
        return wrapper.error({ exception: exceptions.NOT_FOUND });
      }

      return wrapper.data({ items: results });
    } catch (error) {
      logger.log(ctx, error.message, "getUserTransactionHistory");
      return wrapper.error({ message: error.message });
    } finally {
      conn.release();
    }
  }
};


export default TransactionRepository;