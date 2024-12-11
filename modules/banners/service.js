
import httpResponse from "../../helpers/http_responses/index.js";

class BannerService {
  constructor(repo) {
    this.ctx = this.constructor.name;
    this.repo = repo;
  };

  getBanners = async (payload) => {
    const ctx = `${this.ctx}.getBanners`;

    const banners = await this.repo.getBanners();
    if (banners.error) {
      if (banners.exception == exceptions.NOT_FOUND) {
        return new httpResponse.NotFound().setMessage("Data tidak ditemukan");
      }

      logger.log(ctx, banners.message, "this.repo.getBanners()");
      return new httpResponse.InternalServerError().setMessage("Terjadi kesalahan pada server");
    }

    const response = banners.items.map((item) => {
      return {
        banner_name: item.name,
        banner_image: item.image,
        description: item.description
      };
    });

    return new httpResponse.OK().setData(response).setMessage("Sukses");
  };
}

export default BannerService;