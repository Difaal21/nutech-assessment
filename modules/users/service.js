
import httpResponse from "../../helpers/http_responses/index.js";
import cryptography from "../../helpers/cryptography/bcrypt.js";
import jsonwebtoken from "../../helpers/jwt/index.js";
import logger from "../../helpers/utils/logger.js";
import exceptions from "../../helpers/utils/exceptions.js";
import config from "../../config/global_config.js";

class UserService {
    constructor(repo) {
        this.repo = repo;
        this.ctx = this.constructor.name;
    };

    registration = async (payload) => {
        const ctx = `${this.ctx}.registration`;
        const user = await this.repo.getUserByUniqueField("u.email", payload.email);
        if (user.error && user.exception == exceptions.UNEXPECTED_ERROR) {
            logger.log(ctx, user.message, "this.repo.getUserByUniqueField");
            return new httpResponse.InternalServerError().setMessage("Terjadi kesalahan pada server");
        }

        if (user.items) {
            return new httpResponse.Conflict().setMessage("Email sudah terdaftar");
        }

        const password = await cryptography.hashPassword(payload.password);

        const newUser = {
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            password: password,
            created_at: new Date(),
            balance: 0,
        };

        const userId = await this.repo.saveUser(newUser);
        if (!userId) {
            logger.log(ctx, "Registrasi gagal", "this.repo.saveUser");
            return new httpResponse.BadRequest().setMessage("Registrasi gagal");
        }

        return new httpResponse.OK().setData(null).setMessage("Registrasi berhasil silahkan login");
    };

    login = async (payload) => {
        const ctx = `${this.ctx}.login`;
        const user = await this.repo.getUserByUniqueField("u.email", payload.email);
        if (user.error) {
            if (user.exception == exceptions.NOT_FOUND) {
                return new httpResponse.Unauthorized(103).setMessage("Username atau password salah");
            }

            logger.log(ctx, user.message, "this.repo.getUserByUniqueField");
            return new httpResponse.InternalServerError().setMessage("Terjadi kesalahan pada server");
        }

        const isPasswordMatch = await cryptography.comparePassword(payload.password, user.items.password);
        if (!isPasswordMatch) {
            return new httpResponse.Unauthorized(103).setMessage("Username atau password salah");
        }

        const jwt = {
            sub: user.items.id,
            email: user.items.email,
            iss: "nutech",
            exp: Math.floor(Date.now() / 1000) + (12 * 60 * 60),
            iat: Math.floor(Date.now() / 1000),
        };

        const token = jsonwebtoken.generateToken(jwt);
        return new httpResponse.OK().setData({ token }).setMessage("Login Sukses");
    };

    getProfile = async (userId) => {
        const ctx = `${this.ctx}.getProfile`;
        const user = await this.repo.getUserByUniqueField("u.id", userId);
        if (user.error) {
            logger.log(ctx, user.message, "this.repo.getUserByUniqueField");
            return new httpResponse.InternalServerError().setMessage("Terjadi kesalahan pada server");
        }

        if (!user.items) {
            return new httpResponse.NotFound().setMessage("User tidak ditemukan");
        }

        const response = {
            email: user.items.email,
            first_name: user.items.first_name,
            last_name: user.items.last_name,
            profile_image: user.items.profile_image,
        };

        return new httpResponse.OK().setData(response).setMessage("Sukses");
    };


    updateProfile = async (userId, payload) => {
        const ctx = `${this.ctx}.updateProfile`;
        const user = await this.repo.getUserByUniqueField("u.id", userId);
        if (user.error) {
            if (user.exception == exceptions.NOT_FOUND) {
                return new httpResponse.NotFound().setMessage("User tidak ditemukan");
            }

            logger.log(ctx, user.message, "this.repo.getUserByUniqueField");
            return new httpResponse.InternalServerError().setMessage("Terjadi kesalahan pada server");
        }

        const updateData = {
            first_name: payload.first_name,
            last_name: payload.last_name,
        };

        const result = await this.repo.updateUserByID(userId, updateData);
        if (result.error) {
            return new httpResponse.BadRequest().setMessage("Gagal update profile");
        }

        const response = {
            email: user.items.email,
            first_name: payload.first_name,
            last_name: payload.last_name,
            profile_image: user.items.profile_image,
        };
        return new httpResponse.OK().setData(response).setMessage("Update Pofile berhasil");
    }

    uploadProfileImage = async (userId, payload) => {
        const ctx = `${this.ctx}.uploadProfileImage`;
        const user = await this.repo.getUserByUniqueField("u.id", userId);
        if (user.error) {
            if (user.exception == exceptions.NOT_FOUND) {
                return new httpResponse.NotFound().setMessage("User tidak ditemukan");
            }

            logger.log(ctx, user.message, "this.repo.getUserByUniqueField");
            return new httpResponse.InternalServerError().setMessage("Terjadi kesalahan pada server");
        }

        const host = config.get("/host");
        const imageUrl = `${host}/images/profiles/${payload.filename}`;
        const updateData = {
            profile_image: imageUrl,
        };

        const result = await this.repo.updateUserByID(userId, updateData);
        if (result.error) {
            logger.log(ctx, result.message, "this.repo.updateUserByID");
            return new httpResponse.InternalServerError().setMessage("Gagal update profile image");
        }

        const response = {
            email: user.items.email,
            first_name: user.items.first_name,
            last_name: user.items.last_name,
            profile_image: imageUrl
        };

        return new httpResponse.OK().setData(response).setMessage("Update Profile Image berhasil");
    }
}

export default UserService;