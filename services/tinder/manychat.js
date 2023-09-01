const manychat = async (req, res, supabase, upsertUser, uploadImage, storage) => {
    console.log('got here');
    console.log(req.body);
    const { id, ig_username, name, custom_fields, profile_pic, ig_id,phone,email } = req.body;
    const {
      image_url_place_holder_1,
      image_url_place_holder_2,
      user_bio,
      user_gender,
      looking_for,
    } = custom_fields;
  
    let newProfile = {
      id: id,
      name: ig_username ? ig_username : name,
      bio: user_bio ? user_bio : 'user_bio',
      gender: user_gender ? user_gender : 'test bio',
      looking_for: looking_for ? looking_for : 'test looking for',
      ig_id: ig_id ? ig_id : null,
      phone_number: phone ? phone : null,
      email: email ? email : null,
      profile_pic_1:image_url_place_holder_1 ? image_url_place_holder_1 : profile_pic,
      profile_pic_2:image_url_place_holder_2 ? image_url_place_holder_2 : profile_pic,

    };
    upsertUser(supabase, newProfile)
      .then((upserted_user_id) => {
        console.log(`Upserted user with ID: ${upserted_user_id}`);
        res.status(200).send({
          status: 'POST_EVENT_RECEIVED',
          key: image_url_place_holder_1 ? image_url_place_holder_1 : profile_pic,
          supabaseImageUrl: profile_pic,
        });
      })
      .catch((error) => {
        console.log('user process error!!!');
        console.error(error);
        res
          .status(500)
          .send({ error: 'An error occurred while uploading the image' });
      });
  

      //UPLOAD PROFILE PICTURE
    // const randomNumber = Math.floor(Math.random() * (150 - 1 + 1)) + 1;
    // let filename = `${id}${randomNumber}.jpg`;
    // uploadImage(
    //   image_url_place_holder_1 ? image_url_place_holder_1 : profile_pic,
    //   image_url_place_holder_2 ? image_url_place_holder_2 : profile_pic,
    //   storage,
    //   supabase,
    //   filename,
    //   id
    // )
    //   .then((publicURL) => {
    //     res.status(200).send({
    //       status: 'POST_EVENT_RECEIVED',
    //       key: image_url_place_holder_1 ? image_url_place_holder_1 : profile_pic,
    //       supabaseImageUrl: publicURL,
    //     });
    //   })
    //   .catch((error) => {
    //     console.log('image process error!!!');
    //     console.error(error);
    //     res
    //       .status(500)
    //       .send({ error: 'An error occurred while uploading the image' });
    //   });
  };
  
  module.exports = manychat;
  