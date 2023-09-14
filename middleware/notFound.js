const notFoundMiddleware = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  notFoundMiddleware
}