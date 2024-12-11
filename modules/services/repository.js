import exceptions from "../../helpers/utils/exceptions.js";
import logger from "../../helpers/utils/logger.js";
import wrapper from "../../helpers/utils/wrapper.js";

const baseQueryService = `
  SELECT
    id,
    code,
    name,
    icon,
    price,
    created_at
  FROM
    services;
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
};


export default ServiceRepository;

