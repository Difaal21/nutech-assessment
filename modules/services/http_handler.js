
class ServiceHttpHandler {
  constructor(service) {
    this.service = service;
  }

  getServices = async (req, res) => {
    const result = await this.service.getServices();
    return result.send(res);
  }
}


export default ServiceHttpHandler;