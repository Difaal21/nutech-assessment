import validator from "../../helpers/utils/validator.js";
import payloadSchema from "./payload_schema.js";
import httpResponse from "../../helpers/http_responses/index.js";


class UserHttpHandler {
    constructor(service) {
        this.service = service;
    }

    registration = async (req, res) => {
        const payload = req.body;

        const validatePayload = validator.isValid(payload, payloadSchema.registration);
        if (validatePayload.error) {
            return new httpResponse.BadRequest().setMessage(validatePayload.items[0].message).send(res);
        };

        const result = await this.service.registration(payload);
        return result.send(res);
    }

    login = async (req, res) => {
        const payload = req.body;

        const validatePayload = validator.isValid(payload, payloadSchema.login);
        if (validatePayload.error) {
            return new httpResponse.BadRequest().setMessage(validatePayload.items[0].message).send(res);
        };

        const result = await this.service.login(payload);
        return result.send(res);
    }

    getProfile = async (req, res) => {
        const { userId } = req;
        const result = await this.service.getProfile(userId);
        return result.send(res);
    }

    updateProfile = async (req, res) => {
        const { userId } = req;
        const payload = req.body;

        const validatePayload = validator.isValid(payload, payloadSchema.updateProfile);
        if (validatePayload.error) {
            return new httpResponse.BadRequest().setMessage(validatePayload.items[0].message).send(res);
        };

        const result = await this.service.updateProfile(userId, payload);
        return result.send(res);
    }

    uploadProfileImage = async (req, res) => {

        const { userId } = req;
        const payload = req.file;

        const validatePayload = validator.isValid(payload, payloadSchema.uploadProfileImage);
        if (validatePayload.error) {
            return new httpResponse.BadRequest().setMessage(validatePayload.items[0].message).send(res);
        };

        const result = await this.service.uploadProfileImage(userId, payload);
        return result.send(res);
    }
}

export default UserHttpHandler;