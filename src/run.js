const axios          = require('axios')
const { v4: uuidv4 } = require('uuid');
const config         = require('./config')
const util           = require('util')

let lastMessage = {}

if(!process.env.CHAT) {
  console.log('Need to provide valid process.env.CHAT')
  process.exit(1)
}

const sleep = sec => {
  return new Promise((resolve) => {
    setTimeout(resolve, sec*1000);
  });
} 

const getChat = () => {
  return axios.get(`https://api.groupme.com/v3/groups/${process.env.CHAT}/messages?acceptFiles=1&limit=3`, {
    headers: {
      'X-Access-Token': process.env.AUTHTOKEN
    }
  })
}

const sendBigMessage = (sharedBy='') => {  
  const warning = `--- ${process.env.HEADINGS} ---
  --- ${process.env.HEADINGS} ---
  --- ${process.env.HEADINGS} ---
  \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n
  cleaning up convo...
  \n\n\n\n\n\n\n\n\n\n
  ${ util.format(process.env.LOL, sharedBy) }
  ${ util.format(process.env.LOL, sharedBy) }
  ${ util.format(process.env.LOL, sharedBy) }
  \n\n\n\n\n\n\n\n\n\n\n
  --- ${process.env.HEADINGS} ---
  --- ${process.env.HEADINGS} ---
  --- ${process.env.HEADINGS} ---`

  axios.post(`https://api.groupme.com/v3/groups/${process.env.CHAT}/messages`, {
      "message": {
        "text": warning,
        "attachments": [],
        "source_guid": uuidv4()
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': process.env.AUTHTOKEN
      }
  }) 
}

(async function main() {

  let resp = await getChat()
  const thisMessage = (resp.data.response.messages || []).shift()  
  if(thisMessage.id !== lastMessage.id) {
    if(thisMessage.text.includes('https://vm.tiktok.com')) {
      sendBigMessage(thisMessage.name)
    }
    lastMessage = thisMessage
  }

  await sleep(config.THROTTLE_SEC)
  main()

})()