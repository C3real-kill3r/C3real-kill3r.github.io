let token = JSON.parse(localStorage.getItem('token'));
fetch("https://c3real.herokuapp.com/api/v2/entries", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept":"application/json",
                "x-access-token":token
            },
           // body: JSON.stringify(credentials)
        })
        .then((response)=>{
          response.json().then((data) => {
            if (data["message"] == "Token is missing!" || data["message"] == "Token is invalid!"){
                window.location.replace("login.html");
            }
            else{
                /*let Message = document.getElementById("word");
                const FetchedMessage = `<p class"welcomeNote">${data[entr]["username"]}</p>`
                Message.innerHTML = FetchedMessage*/

                let diaryPosts =`<div id="resTable">
                <ul class="responsive-table" id="table">
                <li class="table-header">
                  <div class="col col-1">title</div>
                  <div class="col col-2"></div>
                  <div class="col col-3">date</div>
                  <div class="col col-4"></div>
                  <div class="col col-5"></div>
                  <div class="col col-6"></div>
                </li>`;
                Object.keys(data).forEach(function(entr){
                  let comment = "`"+data[entr]["comment"]+"`";
                  diaryPosts +=`<li class="table-row">
                    <div class="col col-1" id="commentId">${data[entr]["title"]}</div>
                      <div class="col col-2" id="title"></div>
                    <div class="col col-3" id="date">${data[entr]["time"]}</div>
                    <div class="col col-6"><input type="submit" id="myBtn" value="view" onclick="viewEntry(${data[entr]["entry_id"]})"></div>
                    <div class="col col-4"><input type="submit" id="myBtn1" value="edit" onclick="editPost('${data[entr]["entry_id"]}','${data[entr]["title"]}',${comment})"></div>
                    <div class="col col-5"><input type="submit" id="delete" value="delete" onclick="dlt(${data[entr]["entry_id"]})"></div>
                  </li>`;
                });
                document.getElementById("tform").innerHTML = diaryPosts + `</ul></div>`;
            }
              //console.log(data)
          })
        .catch(err => console.log(err));
  })
const logout = () => {
    localStorage.clear();
    window.location.replace("diary_notes.html");
  }

function viewEntry(entry_id){
    let url = "https://c3real.herokuapp.com/api/v2/entries/"+entry_id;
    fetch(url, {
        method : "GET", headers : {
          "Content-Type":"application/json", 
          "x-access-token":token}
    }).then((response)=>response.json())
    .then((data)=>{
      document.getElementById("ttl").innerHTML = data["title"];
      document.getElementById("comment").innerHTML = data["comment"];
      modal.style.display ="block";
    })

    .catch((error) =>console.log(error))

}

function dlt(entry_id){
  let url = "https://c3real.herokuapp.com/api/v2/entries/"+entry_id;
  if(window.confirm("Are you sure you want to delete this entry?")){
  fetch(url, {
      method:"DELETE",
      headers: {
        "Content-Type":"application/json",
        "x-access-token":token}
  })

  .then((res) =>res.json())
  .then((data) => {
      //console.log(data);
      window.location.replace("diary_notes.html");
  })
    }
    else{
        window.location.replace("diary_notes.html");
    }
    }

function editPost(entry_id, title, comment){
  modal2.style.display="block";
  document.getElementById("editForm").innerHTML = `<form id="entryNew">
                <p>want to make it more informative or interesting? Go ahead!</p>
                <div id="editPost">
                <p class="entryMessage"></p>
                <br><br>
                <br><br>
                Title:
                <input type="text" id="title" maxlength="20" value="${title}" required>
                </label><br><br>
                <br><br>
                <label>
                My note:<br>
                <textarea rows="220" cols="150" id="comment" required>
                ${comment}
                </textarea>
                </label>
                <br><br>
                <input type="submit" value="Edit it!" onclick="editEntry(${entry_id})">
                </form>`;
}
function editEntry(entry_id){
  event.preventDefault();
  let title = document.forms["entryNew"]["title"];
  let comment = document.forms["entryNew"]["comment"];

    credentials = {
        title: title.value,
        comment: comment.value
    };
  let url = "https://c3real.herokuapp.com/api/v2/entries/"+entry_id;
  fetch(url, {
      method : "PUT", headers : {
        "Content-Type":"application/json", 
        "x-access-token":token},
        body: JSON.stringify(credentials)
  }).then((response)=>response.json())
  .then((data)=>{
    if (data["message"] == "entry successfully modified!!"){
      window.location.replace("diary_notes.html");
      modal2.style.display ="none";
    }
    else{
      console.log(data)
      const RegResponse = Object(data.message)
      let Message = document.getElementById("editPost");
      const FetchedMessage = `<p class"entryMessage">${RegResponse}</p>`
      Message.innerHTML = FetchedMessage
      modal2.style.display ="block";
  }})
  .catch((error) =>console.log(error))
}