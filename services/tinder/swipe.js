const swipe = async (req, res, supabase, createSwipe,sendTwilioMessage,twilioClient) => {
    // const swiperId = "2078007684";
    // const swipeeId = "1630341182";
    //   const swiperId = "2078007684";
    //   // const swipeeId = "171461978";
    //   // const swipeeId = "350187934";
    //   // const swipeeId = "517369275";
    //   const swipeeId = "1630341182"
  
    const { id, ig_username, name, custom_fields, profile_pic } = req.body.manychatUserData;
    const {
      image_url_place_holder,
      user_bio,
      user_gender,
      looking_for,
      next_match_age,
      next_match_bio,
      next_match_found,
      next_match_gender,
      next_match_id,
      next_match_image_url,
      next_match_looking_for,
      next_match_name,
    } = custom_fields;
    // console.log(req.body.userSwipeAction, id, next_match_id);
  
    const matchStatusTest = true;
    const matchStatus = req.body.userSwipeAction;
  






   console.log( 'swiper and swipee before swipe is created',id,
    next_match_id)



const result = await createSwipe(
      supabase,
      id,
      next_match_id,
      // next_match_id ? next_match_id : swipeeId,
      matchStatus
    );



if (result.error) {
  console.log(result.error);
} else {
  console.log(`Swiper: ${result.swiper.name}`);
  console.log(`Swipee: ${result.swipee.name}`);
  console.log(`Case: ${result.case}`);
  console.log(`State: ${result.state}`);
  if (result.newPositiveSwipe) {
    console.log(`New positive swipe from ${result.swiper.name} to ${result.swipee.name}!`);
  }
  if (result.match) {
    const mssg = `It's a match between ${result.swiper.name} and ${result.swipee.name}!`
    console.log(mssg);
    // sendTwilioMessage(twilioClient, '+17738310785', mssg);

  }
}
    let match = {};
  
    res.status(200).json(result);
  };
  
  module.exports = swipe;
  