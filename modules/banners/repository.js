import exceptions from "../../helpers/utils/exceptions.js";
import logger from "../../helpers/utils/logger.js";
import wrapper from "../../helpers/utils/wrapper.js";

const baseQueryBanner = `
  SELECT
    id,
    name,
    image,
    description,
    created_at
  FROM
    banners
`
class BannerRepository {
  constructor(db) {
    this.db = db;
    this.ctx = this.constructor.name;
  }

  getBanners = async () => {
    const ctx = `${this.ctx}.getBanners`;
    const conn = await this.db.getConnection();
    try {
      const query = baseQueryBanner;

      const [results] = await conn.query(query);
      if (results.length == 0) {
        return wrapper.error({ exception: exceptions.NOT_FOUND });
      }
      return wrapper.data({ items: results });
    } catch (error) {
      logger.log(ctx, error, "getBanners");
      return wrapper.error({ message: error.message, items: error });
    } finally {
      conn.release();
    }
  }
};


export default BannerRepository;

