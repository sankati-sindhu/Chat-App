// const { Socket } = require("socket.io");
const socket = io()
const userId = document.getElementsByClassName("userid")[0].id;
// var friends = document.querySelectorAll('.details');
const form = document.getElementById('add-form')
var friends = []
let currentChat = null;
// console.log(userId)
const getCoversations = async() => {
    try{
        const result = await fetch('/api/coversations/' + userId)

        let coversations = await result.json();

        let urls = [];
        coversations.forEach(function(coversation) {
            const friendId = coversation.members.find((m) => m!== userId )
            // console.log('/api/users/' + friendId)
            urls.push('/api/users/' + friendId);
        });

        Promise.all(
            urls.map( elem => 
                fetch(elem)
                .then(res => res.json())
                .catch(err => console.log(err))
            )
        ).then(friends => {
            for(let i=0; i< friends.length; i++){
                displayFriend(friends[i], coversations[i]._id)
            
            }
        })
        // console.log(friends)

    }catch(err){
        console.log(err);
    }
   
}


getCoversations();


function displayFriend(frd, coversationId) {
 
    const div = document.createElement('div');
    div.classList.add(`block`);
    // console.log(coversationId)
    div.innerHTML = `
            <div class="details">
                <div id=${coversationId} name="coversationId" class="listhead">
                    <h4 id=${frd._id}>${frd.username}</h4>
                </div>
            </div>`;
    div.onclick = function () {
        document.getElementById('chatbox').innerHTML = "";
        const userName = this.getElementsByTagName('h4')[0].firstChild.data
        const coversationId = this.getElementsByClassName('listhead')[0].id;
        const frdId = this.getElementsByTagName('h4')[0].id
        // console.log(this.getElementsByTagName('h4')[0].id)
        // console.log(userName, this.getElementsByClassName('listhead')[0].id);
        // this.classList.add("active");
        document.getElementById('rightHeader').style.display = 'flex';
        document.getElementById('imgPlaceholder').style.display = 'none';
        document.getElementById('chatbox').style.display = 'block';
        document.getElementById('messageBox').style.display = 'flex';
        document.getElementById('clickedFrd').innerHTML = userName;
        document.getElementById('coversationId').innerHTML = coversationId;
        document.getElementById('frdId').innerHTML = frdId;


        getMessages(coversationId);
        
    }
    
    document.querySelector('.chatlist').appendChild(div);
    
}



const getMessages = async(coversationId) => {

    try{
        const result = await fetch('/api/messages/' + coversationId, {
            method: 'GET',
        })
        var data = await result.json();
        // console.log(data)
        document.getElementById('chatbox').innerHTML = "";
        data.forEach(setMessage)
        // setCoversations(data.members);
    }catch(err){
        console.log(err);
    }
}

async function setMessage(message) {
    
    const div = document.createElement('div');
    if(message.sender === userId){
        div.classList.add(`my_msg`);

    }else{
        div.classList.add(`frnd_msg`);

    }
    div.classList.add(`message_in`);
    // div.onclick = clickedFriend();
    div.innerHTML = `
    <p>${message.text}<br><span>${message.updateAt}</span></p>`
    document.querySelector('.chatbox').appendChild(div);
   
}

function sendMessage(){
    const text = document.getElementById('messagebox').value
    const cId = document.getElementById('coversationId').innerText
    const frdId = document.getElementById('frdId').innerText
    socket.emit("sendMessage", {
        senderId: userId,
        receiverId: frdId,
        text: text
    })
    const message = {
        conversationId:cId,
        sender: userId,
        text: text
    }
    try {
        const result = fetch('/api/messages/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        }).then((res) => setMessage(message));
        
    } catch (err) {
        console.log(err)
    }
    // console.log("sending message", message,cId, document.getElementById('coversationId'));
}

socket.on("welcome", message=>{
    console.log(message);
})
socket.on("getUsers", users=>{
    console.log(users);
})
socket.on("getMessage", users=>{
    setMessage({
        sender: users.senderId,
        text: users.text
    })
})
socket.emit("addUser", userId)


// form.addEventListener('submit', function(event){
//     console.log('added this user');
//     event.preventDefault()
//     const frdId = document.getElementById('addUserid').value

//     console.log(frdId, userId)
//     const result = fetch('/api/coversations', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             senderid:userId,
//             recvId: frdId
//         })
//     }).then((res) =>{
//         res.json()
//     }).catch((err)=> console.log(err))
//     console.log(result)
//     if(result){
//         // location.replace('login')
//     }else{
//         console.log("o-o")
//     }
//     // location.replace('login')
// });
