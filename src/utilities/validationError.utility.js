function validationError(details) {
  const result = {};

  details.forEach((detail) => {
    result[detail?.context?.key] = detail?.message;
  });

  return result;
}

module.exports = validationError;
