import exceptions from "../../helpers/utils/exceptions.js";
import logger from "../../helpers/utils/logger.js";
import wrapper from "../../helpers/utils/wrapper.js";

const baseQueryService = `
  SELECT
    s.id,
    s.code,
    s.name,
    s.icon,
    s.price,
    s.created_at
  FROM
    services s
`
class ServiceRepository {
  constructor(db) {
    this.db = db;
    this.ctx = this.constructor.name;
  }

  getServices = async () => {
    const ctx = `${this.ctx}.getServices`;
    const conn = await this.db.getConnection();
    try {
      const query = baseQueryService;

      const [results] = await conn.query(query);
      if (results.length == 0) {
        return wrapper.error({ exception: exceptions.NOT_FOUND });
      }
      return wrapper.data({ items: results });
    } catch (error) {
      logger.log(ctx, error, "getServices");
      return wrapper.error({ message: error.message, items: error });
    } finally {
      conn.release();
    }
  }

  getServiceByCode = async (code) => {
    const ctx = `${this.ctx}.getServiceByCode`;
    const conn = await this.db.getConnection();
    try {
      let query = baseQueryService;

      if (code) {
        query += ` WHERE s.code = ?`;
      }

      const [results] = await conn.query(query, [code]);
      if (results.length == 0) {
        return wrapper.error({ exception: exceptions.NOT_FOUND });
      }
      return wrapper.data({ items: results[0] });
    } catch (error) {
      logger.log(ctx, error.message, "getServiceByCode");
      return wrapper.error({ message: error.message, items: error });
    } finally {
      conn.release();
    }
  };
};


export default ServiceRepository;

