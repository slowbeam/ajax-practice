function generateAdapter(url) {
  return {
    tweetIndex: function() {
      return fetch(url).then(resp => resp.json())
    },
    tweetShow: function(tweetId) {
      return fetch(url + "/" + tweetId).then(resp => resp.json())
    },
    postTweet: function(user, body) {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          body: body,
          user: user
        }),
        headers: {
          'Content-type': 'application/json'
        }
      }).then(resp => resp.json())
    },
    deleteTweet: function(tweetId) {
      return fetch(url + "/" + tweetId, {
        method: 'delete'
      })
    },
    editTweet: function(tweetId, body) {
      return fetch(url + "/" + tweetId, {
        method: 'PATCH',
        body: JSON.stringify({
          body: body,
        }),
        headers: {
          'Content-type': 'application/json'
        }
      })
    }
  }
}
