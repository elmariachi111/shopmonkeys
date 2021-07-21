'use strict'

module.exports = async (event, context) => {
  // const result = {
  //   'body': JSON.stringify(event.body),
  //   'content-type': event.headers["content-type"]
  // }

  console.log(event.body)
  const {num} = event.body
  const result = {result: num*num}
  return context
    .status(200)
    .succeed(result)
}
