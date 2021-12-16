const axios = require("axios");

let user_agents = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'

async function getUserNumber(id, token , user_agent = user_agents){
    // let url = `https://www.olx.ua/api/v1/offers/${id}/phones/`;
    let url = `https://www.olx.ua/api/v1/offers/${id}/limited-phones/`;

    let options = {headers : {'authorization': `Bearer ${token}`, 'User-Agent': user_agent}};

    return axios.get(url,options)
        .then(response => {
            // console.log(response.data.data.phones[0])
            return response.data.data.phones[0];
        })
        .catch(error => {
            try{
                console.log(error)
                if(error.response.statusText=='Unauthorized'){
                    return `Unauthorized User`;
                }
            } catch (e) {
                console.log(e)
            }

        });
}

async function getAdvertData(id, token , user_agent = user_agents){
    let url = `https://www.olx.ua/api/v1/offers/${id}/`;

    let options = {headers : {'authorization': `Bearer ${token}`, 'User-Agent': user_agent}};

    return axios.get(url,options)
        .then(response => {
            console.log(response.data.params)
            return response.data
        })
        .catch(error => {
            try{
                console.log(error)
                if(error.response.statusText=='Unauthorized'){
                    return `Unauthorized User`;
                }
            } catch (e) {
                console.log(e)
            }

        });
}

module.exports  = {getUserNumber, getAdvertData}