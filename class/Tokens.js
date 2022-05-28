const apiUsers = require("../api/UsersOlx");
const {getAuthToken} = require("../module/getAuthToken");


class Token {
    #tokens = {};
    constructor() {}

    async createToken(amount = 1) { // create test to verify user email unique
        let users = this.getUSERS();
        // let users = await apiUsers.getConfirmed();
        let count = amount;
        for (let i = 0; i < users.length; i++) {
            if (count == 0) break;
            const user = users[i];
            if (!this.#tokens[user.email]) {
                await this.recordToken(user);
                count--;
            }
        }

        return this.#tokens;
    }

    async emulationGetToken(user) { // NEED RECURSION FOR TRY CATCH FOR NORMAL CHANGING IP
        let token;
        try {
            token = await getAuthToken(user.email, user.password);
        } catch (e) {
            console.log('e');
            console.log(e);
            console.log('e');
            this.changeIP();
            // token = await getAuthToken(user.email, user.password);
            token = 'error';
        }
        console.log(token);
        return token;
    }

    tokenGetDate() {
        let created = new Date();
        let expired = created.getTime() + 86400000;
        expired = new Date(expired);
        return {created, expired};
    }

    async recordToken(user) {
        let token = await this.emulationGetToken(user);
        let {created, expired} = this.tokenGetDate();
        let tokenObject = {created, expired, token};
        this.#tokens[user.email] = tokenObject;
    }

    changeIP() {
        console.log('IP WAS CHANGED');
    }

    getListTokens() {
        return this.tokensToArray();
    }

    tokensToArray() {
        let buf = {...this.#tokens};
        let arr = [];
        for (const iterator in buf) {
            console.log(iterator);
            console.log(buf[iterator]);
            console.log('------');
            let obj = buf[iterator];
            obj.email = iterator;
            arr.push(obj);
        }
        return arr;
    }

    getUSERS() {
        return [
            {email: "cahesep248@ketchet.com", password: "Grtlove33$"},
        ];
    }

}

module.exports = {Token};