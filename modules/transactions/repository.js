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

      let querySelect = `SELECT balance FROM users_balance WHERE user_id = ? FOR UPDATE`;
      const [results] = await conn.query(querySelect, [userId]);
      if (results.length == 0) {
        await conn.rollback();
        logger.log(ctx, "User not found", "conn.query");
        return wrapper.error({ exception: exceptions.NOT_FOUND });
      }

      const currentBalance = parseFloat(results[0].balance);
      const newBalance = currentBalance + parseFloat(amount);

      let queryUpdate = `UPDATE users_balance SET balance = ? WHERE user_id = ?`;
      await conn.query(queryUpdate, [newBalance, userId]);

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