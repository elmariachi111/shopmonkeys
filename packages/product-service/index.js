const {send} = require ('micro')

const products = (req, res) => {
  send(res, 200, [
    {
        name: '1kg of hot air',
    },
    {
        name: '2l of cold water'
    },
    {
        name: 'a crate of Fritz Mate'
    }
  ]);
}

module.exports = products