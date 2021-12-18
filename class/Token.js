const apiUsers = require("../api/UsersOlx");
const {getAuthToken} = require("../module/getAuthToken");

const startFromAccountPosition = 1

class Token{
    #token;
    static AllTokens = [];
    constructor() {
        this.isUsed = false;
        this.#token = undefined;
        this.userCountId = startFromAccountPosition;
        this.used = 0;
        this.isInit = false;
        this.date = undefined;
    }
    async init(){
        try {
            this.#token = await this.getToken(this.userCountId);
            this.isInit = true;
            this.date = this.#getNow();
        } catch (e) {
            console.log('error init token!!');
        }
    }
    async getToken(){
        if(this.isUsed == true && this.used < 70){
            this.used++;
            return this.#token;
        } else if(this.isUsed == false){
            try {
                let users = await apiUsers.getConfirmed();
                let token = await getAuthToken(users[this.userCountId].email, users[this.userCountId].password);
                this.isUsed = true;
                return token;
            } catch (e) {
                console.log(e);
                console.log('error init token');
            }
        } else if(this.isUsed == true && this.used >= 80){
            try {
                let users = await apiUsers.getConfirmed();
                console.log('users: ' + users.count);
                let token = await getAuthToken(users[this.userCountId].email, users[this.userCountId].password);
                this.#token = token;
                this.used = 0;
                this.userCountId++;
                return token;
            } catch (e) {
                console.log('error init token!!!');
            }
        }

    }
    async getAllTokens(){
        let users = await apiUsers.getConfirmed();
        for (const user of users) {
            console.log(user);
            let token
            try {
                token = await getAuthToken(user.email, user.password);
                Token.AllTokens.push(token);
            } catch (e) {
                console.log('error login in browser by get token')
            }
            console.log(Token.AllTokens);
        }

    }
    #getNow(){
        return Date.now();
    }
}
module.exports = {Token};