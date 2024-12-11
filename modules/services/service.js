
import httpResponse from "../../helpers/http_responses/index.js";
import exceptions from "../../helpers/utils/exceptions.js";

class ServiceService {
  constructor(repo) {
    this.ctx = this.constructor.name;
    this.repo = repo;
  };

  getServices = async () => {
    const ctx = `${this.ctx}.getServices`;

    const services = await this.repo.getServices();
    if (services.error) {
      if (services.exception == exceptions.NOT_FOUND) {
        return new httpResponse.NotFound().setMessage("Data tidak ditemukan");
      }

      logger.log(ctx, services.message, "this.repo.getServices()");
      return new httpResponse.InternalServerError().setMessage("Terjadi kesalahan pada server");
    }

    const response = services.items.map((item) => {
      return {
        service_code: item.code,
        service_name: item.name,
        service_icon: item.icon,
        service_tarif: parseInt(item.price),
      };
    });

    return new httpResponse.OK().setData(response).setMessage("Sukses");
  };
}

export default ServiceService;