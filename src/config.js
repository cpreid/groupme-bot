const dotEnvProcess = require('dotenv').config()

const config = {
    THROTTLE_SEC: 1,    
}

// CLI vars override >> .ENV vars >> config vars
module.exports = Object.assign(config, dotEnvProcess.parsed, process.env)
