
const userId = document.getElementsByClassName("userid")[0].id;
const getCoversations = async() => {
    try{
        const result = await fetch('/api/coversations/' + userId, {
            method: 'GET',
        })
        var data = await result.json();
        data.forEach(setCoversations)
        // setCoversations(data.members);
    }catch(err){
        console.log(err);
    }
}
getCoversations();


async function setCoversations(coversation) {
    const friendId = coversation.members.find((m) => m!== userId )

    const result = await fetch('/api/users/' + friendId);
    const friend = await result.json();
    outFriends(friend);
   
    
}

function outFriends(friend){
    const div = document.createElement('div');
    div.classList.add(`block`);
    div.onclick = clickedFriend();
    div.innerHTML = `
            <div class="details" onclick=>
                <div id=${friend._id} class="listhead">
                <h4>${friend.username}</h4>
                </div>
            </div>`;
    document.querySelector('.chatlist').appendChild(div);


}

function clickedFriend(){
    console.log(
        "clicked user"
    )
}