const axios = require('axios')

let bucketName = 'manychat_instagram_tinder_bot_pictures_bucket'
const aimathsolverBucket = 'aimathsolver'


const supabaseUrl = process.env.SUPABASE_URL
 const supabaseKey = process.env.SUPABASE_KEY

 async function justUploadImage(imageUrl, storage,fileName) {


  // Download image from URL
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
  const imageBuffer = Buffer.from(response.data, 'binary')
  // Upload image to Supabase Storage

  const { data, error } = await storage.from(aimathsolverBucket).upload(fileName, imageBuffer,{contentType: 'image/png'})

  if (error) {
      console.log('error uploading buffer.')
    console.error(error)
    return false
  } else {
    console.log(`Image uploaded to Supabase Storage: ${fileName}`)
    // Get the public URL of the uploaded image
    const { data } = storage.from(aimathsolverBucket).getPublicUrl(fileName)
    console.log({data})
    let publicURL = data.publicUrl
      // return imageUrl
      return publicURL
  }
}



async function justUploadAudio(audioBuffer, storage,fileName) {


  // Download image from URL
  // const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
  // const imageBuffer = Buffer.from(response.data, 'binary')
  // Upload image to Supabase Storage

  const { data, error } = await storage.from(aimathsolverBucket).upload(fileName, audioBuffer,{contentType: 'audio/mp4'})

  if (error) {
      console.log('error uploading buffer.')
    console.error(error)
    return false
  } else {
    console.log(`Image uploaded to Supabase Storage: ${fileName}`)
    // Get the public URL of the uploaded image
    const { data } = storage.from(aimathsolverBucket).getPublicUrl(fileName)
    console.log({data})
    let publicURL = data.publicUrl
      // return imageUrl
      return publicURL
  }
}


async function uploadImage(imageUrl, storage, supabase, fileName, user_id) {
    // Download image from URL
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const imageBuffer = Buffer.from(response.data, 'binary')
    // Upload image to Supabase Storage
    const { data, error } = await storage.from(bucketName).upload(fileName, imageBuffer)
  
    if (error) {
        console.log('error uploading buffer.')
      console.error(error)
      return false
    } else {
      console.log(`Image uploaded to Supabase Storage: ${fileName}`)
      // Get the public URL of the uploaded image
      const { data } = storage.from(bucketName).getPublicUrl(fileName)
      console.log({data})
      let publicURL = data.publicUrl
      // Insert a new row into the manychat_instagram_tinder_bot_pictures table with the new Supabase picture URL
      const { error: insertError } = await supabase.from('manychat_instagram_tinder_bot_pictures').insert([
        { user_id: user_id, picture_url: imageUrl }
        //DO NOT DELETE!! UPLOAD SUPABASE IMAGE URL TO SUPABASE INSTEAD OF MANYCHAT URL
        // { user_id: user_id, picture_url: data.publicUrl } //
      ])
      if (insertError) {
        console.error(insertError)
        return false
      } else {
        return imageUrl
        // return publicURL
      }
    }
  }




async function upsertUser(supabase, userData) {
    // Upsert a row in the manychat_instagram_tinder_bot_users table with the provided user information
    console.log('uploading user data!')
    const { data, error } = await supabase
      .from('manychat_instagram_tinder_bot_users')
      .upsert(userData)
    //   .match({ id: userData.id })
      .select()
  
    // Check for upsert errors
    if (error) {
        console.log('error uploading profile')
      throw error
    }
  
    console.log('data')
    console.log(data)
    // Return the ID of the upserted user as a response for the client
    return data[0].id
  }


  async function findUserByIgId(supabase, ig_id) {


    const { data, error } = await supabase
    .from('manychat_instagram_tinder_bot_users')
    .select('*')
    .eq('ig_id', ig_id)
    .single();
  if (error) {
    console.error(error);
    return;
  }

  return data

  }


  async function supabaseAuthEmailOrPhone(supabase, contact) {

  let contactStructure = {
    id: contact.id,
    email: contact.email ? contact.email : null,
    phone_number: contact.phone_number ? contact.phone_number : null
  }
  const { data, error } = await supabase
        .from('manychat_instagram_tinder_bot_users')
        .upsert(contactStructure)
      //   .match({ id: userData.id })
        .select()
      // Check for upsert errors
      if (error) {
          console.log('error uploading profile')
        throw error
      }
      console.log('data')
      console.log(data)

  return data

  }


  async function createSwipe(supabase, swiperId, swipeeId, matchStatus) {
    console.log('swiper, swipee b4 createSwipe',swiperId, swipeeId)
    // Insert new swipe
    const { data: newSwipe, error: newSwipeError } = await supabase
      .from("manychat_instagram_tinder_bot_swipes")
      .insert({ swiper_id: swiperId, swipee_id: swipeeId, swipe_action: matchStatus });
    if (newSwipeError) {
      console.log(`Error creating swipe: ${newSwipeError.message}`);
      return { error: `Error creating swipe: ${newSwipeError.message}` };
    }
  
    // Check if there is an existing swipe from swipee to swiper
    const { data: existingSwipes, error: existingSwipesError } = await supabase
      .from("manychat_instagram_tinder_bot_swipes")
      .select("*")
      .eq("swiper_id", swipeeId)
      .eq("swipee_id", swiperId);
    if (existingSwipesError) {
      console.log(`Error checking for existing swipes: ${existingSwipesError.message}`);
      return { error: `Error checking for existing swipes: ${existingSwipesError.message}` };
    }
    const existingSwipe = existingSwipes.length > 0 ? existingSwipes[0] : null;
  
    const swiper_id = swiperId
    const swipee_id = swipeeId

    console.log('swiper_id, swipee_id b4 filter',swiper_id, swipee_id)

    const { data: swipee, error: swipeeError } = await supabase
    .from('manychat_instagram_tinder_bot_users')
    .select('*')
    .eq('id', swipee_id)
    .single();


  const { data: swiper, error: swiperError } = await supabase
  .from('manychat_instagram_tinder_bot_users')
  .select('*')
  .eq('id', swiper_id)
  .single();


  if (swiperError ||swipeeError ) {
      console.log(`Error getting user details: ${swiperError?.message? swiperError.message : swipeeError.message}`);
      return { error: `Error getting user details: ${usersError.message}` };
    }

    console.log('swiper, swipee after swipe is created',swiper, swipee)
  


    // Handle different cases
    let result = { swiper, swipee };
    if (!existingSwipe) {
      // No existing swipe from swipee to swiper
      result.case = "No existing swipe from swipee to swiper";
      if (matchStatus) {
        // Swiper swiped right on swipee
        result.newPositiveSwipe = true;
        result.match = false;
        result.state = "New positive swipe from swiper to swipee";
      } else {
        // Swiper swiped left on swipee
        result.newPositiveSwipe = false;
        result.match = false;
        result.state = "No match between swiper and swipee";
      }
    } else {
      // Existing swipe from swipee to swiper
      result.case = "Existing swipe from swipee to swiper";
      if (matchStatus && existingSwipe.swipe_action) {
        // Both swiped right on each other
        result.newPositiveSwipe = true;
        result.match = true;
        result.state = "It's a match between swiper and swipee!";
      } else {
        // At least one swiped left
        result.newPositiveSwipe = false;
        result.match = false;
        result.state = "No match between swiper and swipee";
      }
    }
    return result;
  }
  

async function findMatch(supabase, swiper_id) {
    const { data: swiper, error: swiperError } = await supabase
      .from('manychat_instagram_tinder_bot_users')
      .select('gender')
      .eq('id', swiper_id)
      .single();
    if (swiperError) {
      console.error(swiperError);
      return;
    }
  
    const { data: swipees, error: swipeesError } = await supabase
      .from('manychat_instagram_tinder_bot_swipes')
      .select('swipee_id')
      .eq('swiper_id', swiper_id);
    if (swipeesError) {
      console.error(swipeesError);
      return;
    }
    const swipee_ids = swipees.map(swipee => swipee.swipee_id);
  
    // {"matchFound":true,"swipee":{"id":"517369275","name":"zabihaeating","bio":"Nice girl","gender":"Female","looking_for":"Male","ig_id":"6878815712152849","phone_number":"+15417543010","email":null,"profile_pic_1":"https://lookaside.fbsbx.com/ig_messaging_cdn/?asset_id=1006240587350672&signature=AbzU8l3fYzCpRtmPDQ_p6l3wEyNh1-RuhYrjm_Rx07kB-Jz8bxcP4fRdMUhNWu7pnx5OJvqTQtgAUeb1Hr8JW8Jm4GJgfRpMdqxXgYMEuufXDFgpOdUBm0IbJdDGqtftBSEdajeiD2nkcYFRT2Odd0htqo24KNdlWIAB6wYr47oUQYaK4uwsSSE02-No4xzQWHHACAynie6ggy6Nnh6IEf0SsEHirg","profile_pic_2":"https://manychat.com/ava/718702/517369275/0f237e1c8992fde0316d01b32556a564"}}

    console.log(swipees)
    console.log(swipee_ids)
    let query = supabase
      .from('manychat_instagram_tinder_bot_users')
      .select("*")
      // .select(`id, name, bio, gender, looking_for, manychat_instagram_tinder_bot_pictures (picture_url)`)
      .not('id', 'eq', swiper_id)
      .eq('looking_for', swiper.gender);
    if (swipee_ids.length > 0) {

      for (const swipee_id of swipee_ids) {
        query = query.not('id', 'eq', swipee_id);
      }
    }
    
    const { data: swipee, error: swipeeError } = await query.limit(1).then(res => ({data: res.data[0]}));
    if (swipeeError) {
        console.log('error!!')
      console.error(swipeeError);
      return;
    }
  
    const result = {
      matchFound: !!swipee,
      swipee: swipee || {}
    };
    console.log('done!!')
  
    // console.log(result)
    return result;
  }
    
  
  
module.exports = { justUploadImage,justUploadAudio, uploadImage, upsertUser, createSwipe, findMatch, findUserByIgId, supabaseAuthEmailOrPhone }