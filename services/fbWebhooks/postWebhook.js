const postWebhook = (req, res,Receive,isGuestUser,User,users,GraphApi,i18n,setDefaultUser,receiveAndReturn) => {

    console.log('webhook /POST coming through')
    let body = req.body;
    console.log(`\u{1F7EA} Received webhook:`);
    // console.dir(body, { depth: null });
    // Check if this is an event from a page subscription
    if (body.object === "page") {
      // Returns a '200 OK' response to all requests
      res.status(200).send("EVENT_RECEIVED");
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(async function (entry) {
        if ("changes" in entry) {
          // console.dir(entry, { depth: null });
  
          // Handle Page Changes event
          let receiveMessage = new Receive();
          if (entry.changes[0].field === "feed") {
            let change = entry.changes[0].value;
            let postId = change.post_id
            // let [postId,] = [change.post_id,];
            console.log("a change was made to this post with id")
            // console.dir(change, { depth: null });
            if (change.verb == 'add') { // checking against change.verb !== 'remove'
            switch (change.item) {
              case "post":
                return receiveMessage.handlePrivateReply(
                  "post_id",
                  change.post_id
                );
              case "comment":
                return receiveMessage.handlePrivateReply(
                  "comment_id",
                  change.comment_id
                );
              default:
                console.warn("Unsupported feed change type.");
                return;
            }
          }
        }
          if (entry.changes[0].field === "mention") {
              console.log('received a mention!')
            console.log(entry)
          }
        }
        // Iterate over webhook events - there may be multiple
        entry.messaging && entry.messaging.forEach(async function (webhookEvent) {
          // Discard uninteresting events
          if ("read" in webhookEvent) {
            console.log("Got a read event");
            return;
          } else if ("delivery" in webhookEvent) {
            console.log("Got a delivery event");
            return;
          } else if (webhookEvent.message && webhookEvent.message.is_echo) {
            console.log(
              "Got an echo of our send, mid = " + webhookEvent.message.mid
            );
            return;
          }
          // Get the sender PSID
          let senderPsid = webhookEvent.sender.id;
          // Get the user_ref if from Chat plugin logged in user
          let user_ref = webhookEvent.sender.user_ref;
          // Check if user is guest from Chat plugin guest user
          let guestUser = isGuestUser(webhookEvent);
          if (senderPsid != null && senderPsid != undefined) {
            if (!(senderPsid in users)) {
              if (!guestUser) {
                // Make call to UserProfile API only if user is not guest
                let user = new User(senderPsid);
                GraphApi.getUserProfile(senderPsid)
                  .then((userProfile) => {
                    user.setProfile(userProfile);
                  })
                  .catch((error) => {
                    // The profile is unavailable
                    console.log(JSON.stringify(body));
                    console.log("Profile is unavailable:", error);
                  })
                  .finally(() => {
                    console.log("locale: " + user.locale);
                    users[senderPsid] = user;
                    i18n.setLocale("en_US");
                    console.log(
                      "New Profile PSID:",
                      senderPsid,
                      "with locale:",
                      i18n.getLocale()
                    );
                    return receiveAndReturn(
                      users[senderPsid],
                      webhookEvent,
                      false
                    );
                  });
              } else {
                setDefaultUser(senderPsid);
                return receiveAndReturn(users[senderPsid], webhookEvent, false);
              }
            } else {
              i18n.setLocale(users[senderPsid].locale);
              console.log(
                "Profile already exists PSID:",
                senderPsid,
                "with locale:",
                i18n.getLocale()
              );
              return receiveAndReturn(users[senderPsid], webhookEvent, false);
            }
          } else if (user_ref != null && user_ref != undefined) {
            // Handle user_ref
            setDefaultUser(user_ref);
            return receiveAndReturn(users[user_ref], webhookEvent, true);
          }
        });
      });
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
   
  };
  
  module.exports = postWebhook;
  