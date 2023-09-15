const errorHandlerMiddleware = (error, request, response, next) => {
  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

module.exports = errorHandlerMiddleware