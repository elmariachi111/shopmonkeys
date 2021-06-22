'use strict'

module.exports = async (event, context) => {

  const body = [
    {
        name: '1kg of hot air',
    },
    {
        name: '2l of cold water'
    },
    {
        name: 'a crate of Fritz Mate'
    }
  ]
  
  return context
    .headers({
      'Content-Type': 'application/json'
    })
    .status(200)
    .succeed(JSON.stringify(body))
}
