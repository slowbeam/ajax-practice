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


  let allTweetStore = []


  storeAllTweets()
  generateTweets()


  rootDiv.addEventListener("click", function(event) {

    switch (event.target.dataset.action) {
      case "post-tweet":
        event.preventDefault();
        tweetAdapter.postTweet(usernameField.value, tweetField.value).then(data => {allTweetStore.push(data)}).then(resp => document.getElementById("post-tweet-form").reset()).then(generateTweets)
        break;
      case "render":
        renderSite();
        break;
      case "delete-tweet":
        tweetAdapter.deleteTweet(event.target.dataset.tweetId).then((resp)=> getUrlId(resp.url)).then((tweetId)=> filterTweetArray(allTweetStore, tweetId)).then((resp)=> setAllTweetStore(resp)).then(generateTweets)
        break;

      case "edit-tweet":
          const tweetToEdit = findLocalTweet(parseInt(event.target.dataset.tweetEditId))
          document.getElementById("post-form").innerHTML = `
           <h3>Edit Your Tweet</h3>
            <form action="index.html" class="form" method="patch">
               Username:<br><strong>
              ${tweetToEdit.user}</strong><br>
               Tweet:<br>
               <textarea id="tweet-edit-input" data-tweet-body=${tweetToEdit.body} type="text" name="tweet-content" rows="4" cols="30">${tweetToEdit.body}</textarea>
               <br><br>
               <input data-action="patch-tweet" data-patch-id=${tweetToEdit.id}  type="submit" name="" value="Edit Tweet">
             </form><br>
             <button data-action="render">post a new tweet</button>

         `;
          event.preventDefault();

        break;

      case "patch-tweet":
        event.preventDefault()
        const editBodyField = document.getElementById("tweet-edit-input")

        tweetAdapter.editTweet(event.target.dataset.patchId, editBodyField.value).then((resp)=> getUrlId(resp.url)).then((tweetId)=> editLocalTweet(tweetId, editBodyField.value)).then(()=>renderSite(document.getElementById("main-div")))
    }
  });

  function findLocalTweet(id){
    const foundTweet = allTweetStore.find((el) => el.id === id)
    return foundTweet
  }
  function editLocalTweet(id, body){
    const foundTweet = allTweetStore.find((el) => el.id === id)
    foundTweet.body = body
    return allTweetStore
  }

  function setAllTweetStore(newStore){
    allTweetStore = newStore
  }

  function filterTweetArray(arr, id){
    let filteredArray = arr.filter(tweetObj=> (tweetObj.id !== id))
    return filteredArray
  }

  function getUrlId(url){
    let splitUrl= url.split('/');
    let numString = splitUrl[splitUrl.length-1]
    return parseInt(numString)
  }

  function makeLocalTweetLoop(tweetArray){
    for (el of tweetArray){
      allTweetStore.push(el)
    }
  }

//the store last tweet function WORKS stop debugging it.
  function storeLastTweet(){
    tweetAdapter.tweetIndex().then((resp) => {return resp[(resp.length - 1)]}).then((resp)=>{allTweetStore.push(resp)})
  }


  function storeAllTweets(){
    tweetAdapter.tweetIndex().then(resp => makeLocalTweetLoop(resp)).then(() => {allTweetStore;generateTweets()})
  }


  function generateTweets() {
    const allTweetHTML = allTweetStore.map(tweetObj =>
            `
            <div class="tweet">
            <h3>username: ${tweetObj.user}</h3>
            <p><strong>tweet: </strong><br>${tweetObj.body}<p>
            <button data-action="delete-tweet" data-tweet-id="${tweetObj.id}" class="delete-button">🚫 delete 🚫</button>
            <button data-action="edit-tweet" data-tweet-edit-id="${tweetObj.id}" class="delete-button">🤔 edit🤔 </button>
            </div>
            `
    )

    tweetDiv.innerHTML = allTweetHTML.join("")
  }


  function renderSite(div) {
    div.innerHTML = `<div id="tweet-form" style="float: left; width: 50%;">
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
        <div id="tweets-title"><h1>tweets</h1></div>
        <div id="tweet-list">

        </div>
    </div>

    `
    tweetDiv = document.getElementById("tweet-list")
    usernameField = document.getElementById("username-input")
    tweetField = document.getElementById("tweet-input")
    generateTweets()

  }

})
