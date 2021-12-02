const apiUsers = require("../api/UsersOlx");
const {getAuthToken} = require("../module/getAuthToken");


class Token{
    #token;
    constructor() {
        this.isUsed = false;
        this.#token = undefined;
        this.userCountId = 5;
        this.used = 0;
        this.isInit = false;
    }
    async init(){
        try {
            this.#token = await this.getToken(this.userCountId);
            this.isInit = true;
        } catch (e) {
            console.log('error init token2');
        }
    }
    async getToken(){
        // console.log('asidpoasodkpaos');

        if(this.isUsed == true && this.used < 70){
            this.used++;
            console.log('this.used =' + this.used);
            return this.#token;
        } else if(this.isUsed == false){
            try {
                let users = await apiUsers.getConfirmed();
                let token = await getAuthToken(users[this.userCountId].email, users[this.userCountId].password);
                this.isUsed = true;
                return token;
            } catch (e) {
                console.log('error init token1');
            }
        } else if(this.isUsed == true && this.used >= 70){
            try {
                let users = await apiUsers.getConfirmed();
                let token = await getAuthToken(users[this.userCountId].email, users[this.userCountId].password);
                this.#token = token;
                this.used = 0;
                this.userCountId++;
                return token;
            } catch (e) {
                console.log('error init token3');
            }
        }

    }
}
module.exports = {Token};