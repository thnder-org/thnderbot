
// Required Libraries
var CronJob = require('cron').CronJob
const fs = require('fs')
const discordHelper = require("./helpers/DiscordHelper")
var twitterHelper = require("./helpers/TwitterHelper")
var twitterConfig = require('./config/twitter.json')

// Discord Section
discordHelper.start()



// // Twitter integrations
// function runCron(){
//     if(twitterConfig.cron){
//         var job = new CronJob(twitterConfig.cron_schedule, async function() {
//             let latestTweetID = getLatestTweet()
//             let latest = await twitterHelper.getLatestTweet()
//             if(latestTweetID == null || latestTweetID != latest.id){
//                 await updateLatestTweetID(latest.id)
//                 await postLatestTweetToDiscord(latest.text)
//             }
//           }, null, true, 'America/New_York');
//           job.start();
//     }
// }


// runCron()

// function getTwitterConfig(){
//     let rawdata = fs.readFileSync("./config/twitter.json")
//     let tempTwitterConfig = JSON.parse(rawdata)
//     return tempTwitterConfig
// }

// function getLatestTweet(){
//     return getTwitterConfig().last_tweet_id
// }

// function postLatestTweetToDiscord(message){
//     sendToChannel(channel_ids.bot_testing, message)
// }

// function updateLatestTweetID(id){
//     let tempTwitterConfig = getTwitterConfig()
//     tempTwitterConfig.last_tweet_id = id
//     fs.writeFileSync("./config/twitter.json", JSON.stringify(tempTwitterConfig));
// }
