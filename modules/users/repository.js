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
    try {
      let query = baseQueryUser;

      if (field && value) {
        query += ` WHERE ${field} = ?`;
      }

      const [results] = await this.db.query(query, [value]);
      if (results.length == 0) {
        return wrapper.error({ exception: exceptions.NOT_FOUND });
      }
      return wrapper.data({ items: results[0] });
    } catch (error) {
      logger.log(this.ctx, error, "getOneUserByUniqueField");
      return wrapper.error({ message: error.message, items: error });
    };
  };

  async saveUser(payload) {
    try {
      const query = `
        INSERT INTO users (first_name, last_name, email, password, created_at)
        VALUES (?, ?, ?, ?, ?)
      `;
      const { first_name, last_name, email, password, created_at } = payload;
      const [result] = await this.db.query(query, [first_name, last_name, email, password, created_at]);

      return wrapper.data({ items: result.insertId });
    } catch (error) {
      logger.log(this.ctx, error.message, "saveUser");
      return wrapper.error({ message: error.message, items: error });
    };
  };

  async updateUserByID(id, payload) {
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

      const [result] = await this.db.execute(query, values);
      return wrapper.data({ items: result.affectedRows });
    } catch (error) {
      logger.log(this.ctx, error.message, "updateUserByID");
      return wrapper.error({ message: error.message, items: error });
    }
  }
}

export default UserRepository;