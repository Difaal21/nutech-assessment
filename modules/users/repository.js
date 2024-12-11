import exceptions from "../../helpers/utils/exceptions.js";
import logger from "../../helpers/utils/logger.js";
import wrapper from "../../helpers/utils/wrapper.js";

const baseQueryUser = `
  SELECT
    id,
    first_name,
    last_name,
    email,
    profile_image,
    created_at,
    password
  FROM
    users u`;

class UserRepository {
  constructor(db) {
    this.db = db;
    this.ctx = this.constructor.name;
  };

  async getUserByUniqueField(field, value) {
    const ctx = `${this.ctx}.getUserByUniqueField`;
    const conn = await this.db.getConnection();
    try {
      let query = baseQueryUser;
      if (field && value) {
        query += ` WHERE ${field} = ?`;
      }

      const [results] = await conn.query(query, [value]);
      if (results.length == 0) {
        return wrapper.error({ exception: exceptions.NOT_FOUND });
      }
      return wrapper.data({ items: results[0] });
    } catch (error) {
      logger.log(ctx, error, "getOneUserByUniqueField");
      return wrapper.error({ message: error.message, items: error });
    } finally {
      conn.release();
    }
  };

  async saveUser(payload) {
    const ctx = `${this.ctx}.saveUser`;
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();

      const queryUser = `
        INSERT INTO users (first_name, last_name, email, password, created_at)
        VALUES (?, ?, ?, ?, ?)
      `;
      const { first_name, last_name, email, password, created_at, balance } = payload;
      const [resultUser] = await conn.query(queryUser, [first_name, last_name, email, password, created_at]);

      const userId = resultUser.insertId;

      const queryBalance = `
        INSERT INTO users_balance (user_id, balance)
        VALUES (?, ?)
      `;

      const [resultBalance] = await conn.query(queryBalance, [userId, balance]);
      await conn.commit();
      return wrapper.data({ items: userId });
    } catch (error) {
      await conn.rollback();
      logger.log(ctx, error.message, "saveUser");
      return wrapper.error({ message: error.message, items: error });
    } finally {
      conn.release();
    }
  };

  async updateUserByID(id, payload) {
    const ctx = `${this.ctx}.updateUserByID`;
    const conn = await this.db.getConnection();

    try {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(payload)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }

      const query = `
        UPDATE users
        SET ${fields.join(', ')}
        WHERE id = ?
      `;

      values.push(id);

      const [result] = await conn.execute(query, values);
      return wrapper.data({ items: result.affectedRows });
    } catch (error) {
      logger.log(ctx, error.message, "updateUserByID");
      return wrapper.error({ message: error.message, items: error });
    } finally {
      conn.release();
    }
  }
}

export default UserRepository;