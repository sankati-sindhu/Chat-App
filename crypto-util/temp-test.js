const cryptWorker = require('crypto-util.js')
const originPublicKey = getWebWorkerResponse('generate-keys')

console.log(originPublicKey)