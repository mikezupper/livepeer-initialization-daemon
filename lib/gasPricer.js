const https = require("https")
const web3 = require("web3")

class EGSGasPricer {
    constructor() {
        this.apiUrl = "https://ethgasstation.info/json/ethgasAPI.json"
    }

    async getGasPrice() {
        const res = await httpsGet(this.apiUrl)
        // The ethgasstation returns gas prices as x10 gwei
        let price = web3.utils.toBN(
            web3.utils.toWei((JSON.parse(res).fast / 10).toString(), "gwei")
        ) 
        // Multiply by 1.2 to bump the price a bit
        return price.mul(web3.utils.toBN(120)).div(web3.utils.toBN(100)).toString()
    }
}

class Web3GasPricer {
    constructor(provider) {
        this.web3 = new Web3(provider) 
    }

    async getGasPrice() {
        return this.web3.eth.getGasPrice()
    }
}

const httpsGet = url => {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error(`Status Code: ${res.statusCode}`))
            }

            const data = []

            res.on("data", chunk => {
                data.push(chunk)
            })

            res.on("end", () => resolve(Buffer.concat(data).toString()))
        })
    })
}

module.exports = {
    EGSGasPricer,
    Web3GasPricer
}