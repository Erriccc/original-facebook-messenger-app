const rampwin = async (req, res) => {
    console.log('ig id from manychat: ',req.body)
    res.status(200).send({match:"yes"});
  };
  module.exports = rampwin;
  