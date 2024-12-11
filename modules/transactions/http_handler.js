
class TransactionHttpHandler {
  constructor(service) {
    this.service = service;
  }

  getUserBalance = async (req, res) => {
    const { userId } = req;
    const result = await this.service.getUserBalance(userId);
    return result.send(res);
  }
}


export default TransactionHttpHandler;