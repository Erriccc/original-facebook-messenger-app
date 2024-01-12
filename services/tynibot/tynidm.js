const axios = require('axios');

const tynidm = async (req, res) => {
   
  
    const { first_name,id } = req.body;

    console.log('gothere..')
    console.log('first_name',id)
    console.log('first_name',typeof id)


    console.log('gothere..')
    console.log('first_name',first_name)
    console.log('first_name',typeof first_name)
    
  
    // toString()
    // const string4 = new String("A String object");



    async function query(data) {
      console.log('boutta make api call.')
      const response = await fetch(
          "https://mintchi-flowiseai.up.railway.app/api/v1/prediction/fff2194a-bfd8-4fe9-9d16-69a6f0ea9b57",
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(data)
          }
      );
      console.log('got a responce')
      const result = await response.json();
      return result;
  }
  
  await query({
    // "question": "Hey, how are you?","overrideConfig": {"sessionId": `${first_name}`}}).then((response) => {
      "question": "Hey, how are you?","overrideConfig": {"sessionId": "9ca20f60-6336-4b7d-bcc4pppp"}}).then((response) => {
      console.log(response);
    res.status(200).json({yoo:'yooooo', response});

  });


    // res.status(200).json({yoo:'yooooo'});
  };
  
  module.exports = tynidm;
  
