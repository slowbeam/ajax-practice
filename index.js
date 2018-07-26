document.addEventListener('DOMContentLoaded', () => {
  const tweetAdapter = generateAdapter("http://localhost:3000/tweets")
  const mainDiv = document.getElementById("main-div")
  const rootDiv = document.getElementById("root-div")
  let usernameField = document.getElementById("username-input")
  let tweetField = document.getElementById("tweet-input")
  let tweetDiv = document.getElementById("tweet-list")
  const editFormDiv = document.getElementById("edit-form")
  const postFormDiv = document.getElementById("post-form")
  const tweetForm = document.getElementById("tweet-form")


  generateTweets()


  rootDiv.addEventListener("click", function(event) {

    switch (event.target.dataset.action) {
      case "post-tweet":
        event.preventDefault();
        tweetAdapter.postTweet(usernameField.value, tweetField.value).then(resp => generateTweets()).then(resp => document.getElementById("post-tweet-form").reset())

        break;
      case "render":
        renderSite();
        break;
      case "delete-tweet":
        tweetAdapter.deleteTweet(event.target.dataset.tweetId).then(resp => generateTweets())
        break;

      case "edit-tweet":
        tweetAdapter.tweetShow(event.target.dataset.tweetEditId).then(resp => {
          document.getElementById("post-form").innerHTML = `
           <h3>${resp.user}</h3>
            <form action="index.html" class="form" method="patch">
               Username:<br><strong>
              ${resp.user}</strong><br>
               Tweet:<br>
               <textarea id="tweet-edit-input" data-tweet-body=${resp.body} type="text" name="tweet-content" rows="4" cols="30">${resp.body}</textarea>
               <br><br>
               <input data-action="patch-tweet" data-patch-id=${resp.id}  type="submit" name="" value="Edit Tweet">
             </form><br>
             <button data-action="render">post a new tweet</button>

         `;
          event.preventDefault();
        })
        break;

      case "patch-tweet":
        event.preventDefault()
        const editBodyField = document.getElementById("tweet-edit-input")

        tweetAdapter.editTweet(event.target.dataset.patchId, editBodyField.value).then(resp => renderSite())
    }
  });


  function generateTweets() {
    tweetAdapter.tweetIndex().then(resp => resp.map(tweetObj =>
            `
            <div class="tweet">
            <h3>username: ${tweetObj.user}</h3>
            <p><strong>tweet: </strong><br>${tweetObj.body}<p>
            <button data-action="delete-tweet" data-tweet-id="${tweetObj.id}" class="delete-button">🚫 delete 🚫</button>
            <button data-action="edit-tweet" data-tweet-edit-id="${tweetObj.id}" class="delete-button">🤔 edit🤔 </button>
            </div>
            `
    ).join("")).then(resp => tweetDiv.innerHTML = resp)

  }


  function renderSite() {
    mainDiv.innerHTML = `<div id="tweet-form" style="float: left; width: 50%;">
      <div id="twitter-title"><img src="https://imgur.com/TCgOtFn.png" height="75" width="75" alt="twitter-logo"></div>
      <div id="post-form">
        <h3> Post a Tweet: </h3>
        <form class="form" id="post-tweet-form" action="index.html" method="post">
          Username:<br>
          <input id="username-input" type="text" name="username" value=""><br>
          Tweet:<br>
          <textarea id="tweet-input" type="text" name="tweet-content" rows="4" cols="30"></textarea><br><br>
          <input data-action="post-tweet" type="submit" name="" value="Post Tweet">
        </form>
      </div>

    </div>

    <div id="all-tweets" style="float: left; width: 50%;">
        <div id="tweets-title"><h1>ALL TWEETS</h1></div>
        <div id="tweet-list">

        </div>
    </div>

    `
    tweetDiv = document.getElementById("tweet-list")
    usernameField = document.getElementById("username-input")
    tweetField = document.getElementById("tweet-input")
    generateTweets()
    // usernameField.value = ""
    // tweetField.value = ""

  }

  function renderTweetForm() {
    tweetForm.innerHTML =
      `<div id="twitter-title"><img src="https://imgur.com/TCgOtFn.png" height="75" width="75" alt="twitter-logo"></div>

      <div id="post-form">
        <h3> Post a Tweet: </h3>
        <form id="post-tweet-form" class="form" action="index.html" method="post">
          Username: <br>
          <input id="username-input" type="text" name="username" value=""><br>
          Tweet:<br>
          <textarea id="tweet-input" type="text" name="tweet-content" rows="4" cols="30"></textarea><br><br>
          <input data-action="post-tweet" type="submit" name="" value="Post Tweet">
        </form>
      </div>
      `
  }
})
