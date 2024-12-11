class Response {
    constructor(code, status) {
        this.code = code;
        this.status = status;
        this.message = "";
        this.data = null;
    }

    setMessage(message) {
        this.message = message;
        return this;
    };

    setData(data) {
        this.data = data;
        return this;
    };

    setStatus(status) {
        this.status = status;
        return
    }

    send(res) {
        return res
            .status(this.code)
            .json({
                status: this.status,
                message: this.message,
                data: this.data
            });
    }
}

export default Response;