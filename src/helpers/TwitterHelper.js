const axios = require('axios')
const util = require('util')

const auth = require('../config/auth.json')
const twitterConfig = require('../config/twitter.json')


class TwitterHelper{
    constructor(){
        this.app = null
        this.username = twitterConfig.username
        this.last_tweet_id = null
    }

    async getTweets(){
        console.log("login")
        await this.getUser("thnder_")
        return 
    }

    async getUser(username){
        let url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}`
        let headers = {'Authorization': `Bearer ${auth.twitter.bearertoken}`}
        let res = await axios.get(url, {headers})
            .then((res) => {return res})
            .catch((e)=>console.log(e))

        // res is our tweet timeline
        // res[0] is the first element
    }

    // Pulls in your latest tweet
    async getLatestTweet(){
        let url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${this.username}`
        let headers = {'Authorization': `Bearer ${auth.twitter.bearertoken}`}
        let res = await axios.get(url, {headers})
            .then((res) => {return res})
            .catch((e)=>console.log(e))

        return res.data[0]
    }

    async postLatestTweet(){
        //do stuff
    }


}

module.exports  = new TwitterHelper()