const axios = require('axios')

const findmatch = async (req, res, supabase, findMatch) => {
    console.log('ig id from manychat: ', req.body.ig_id);
    const { id, ig_username, name, custom_fields, profile_pic, ig_id } = req.body;
    const {
      image_url_place_holder,
      user_bio,
      user_gender,
      looking_for,
    } = custom_fields;
    console.log(id);
    const match = await findMatch(supabase, id);
  
    res.status(200).send(match);
  };
  
  module.exports = findmatch;
  