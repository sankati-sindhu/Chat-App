// importScripts('https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/2.3.1/jsencrypt.min.js');
var crypt;
var privateKey;
const form = document.getElementById('reg-form')
form.addEventListener('submit', function(event){
    console.log('the user submitted form');
    const publicKey = generateKeypair ();
    event.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
   
    console.log(username, password)
    const result = fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            privateKey,
            publicKey
        })
    }).then((res) =>{
        res.json()
    }).catch((err)=> console.log(err))
    // console.log(result)
    if(result){
        location.replace('login')
    }else{
        console.log("o-o")
    }
    location.replace('login')
});

function generateKeypair () {
  crypt = new JSEncrypt({default_key_size: 2056})
  privateKey = crypt.getPrivateKey()

  // Only return the public key, keep the private key hidden
  return crypt.getPublicKey()
}
