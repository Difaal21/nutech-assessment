
class BannerHttpHandler {
  constructor(service) {
    this.service = service;
  }

  getBanners = async (req, res) => {
    const result = await this.service.getBanners();
    return result.send(res);
  }
}


export default BannerHttpHandler;