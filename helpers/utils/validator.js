import validate from "validate.js";
import wrapper from "./wrapper.js";
import exceptions from "./exceptions.js";

const isValid = (payload, constraint) => {
    const { value, error } = constraint.validate(payload);
    if (!validate.isEmpty(error)) {
        return wrapper.error({ items: error.details, message: "Validation error", exception: exceptions.BAD_REQUEST });
    };
    return wrapper.data({ items: value });
};

export default { isValid };
