import exceptions from "./exceptions.js";

const error = ({ message = "", items = null, exception = exceptions.UNEXPECTED_ERROR }) => {
  return {
    error: true,
    message: message,
    items: items,
    exception: exception
  }
}


const data = ({ items = null, message = "" }) => {
  return {
    error: false,
    items: items,
    message: message
  }
}

export default { error, data };