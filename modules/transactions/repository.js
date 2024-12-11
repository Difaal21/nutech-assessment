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
      let query = `SELECT balance FROM users_balance WHERE user_id = ?`;

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
};


export default TransactionRepository;