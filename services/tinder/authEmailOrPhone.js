const crypto = require('crypto');

function generateRandomPin(length) {
  const randomBytes = crypto.randomBytes(length);
  const randomString = randomBytes.toString('hex');
  return randomString.substring(0, length);
}


const authEmailOrPhone = async (req, res, supabase, supabaseAuthEmailOrPhone,) => {
    console.log('got here');
    console.log(req.body);



    const pin = generateRandomPin(4);
    console.log('PIN::',pin); // 1234
    


    const { id, ig_username, name, custom_fields, profile_pic, ig_id,phone,email } = req.body;
    const {
      image_url_place_holder,
      user_bio,
      user_gender,
      looking_for,
    } = custom_fields;
  
   
    console.log('hi')
      // .then((upserted_user_id) => {
        // console.log(`Upserted user with ID: ${upserted_user_id}`);
        res.status(200).send({
            status: 'POST_EVENT_RECEIVED',
            pin
          });
      // })
      // .catch((error) => {
      //   console.log('user process error!!!');
      //   console.error(error);
      //   res
      //     .status(500)
      //     .send({ error: 'An error occurred while uploading the image' });
      // });
    const randomNumber = Math.floor(Math.random() * (150 - 1 + 1)) + 1;
    
  };
  
  module.exports = authEmailOrPhone;
  




