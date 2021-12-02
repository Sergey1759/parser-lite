var mongoose = require('mongoose')

var Data = require('../models/usersMailru');

async function createData( name, lastname,email, password){
    return new Data({name,lastname,email,password}).save();
}

async function getAll(){
    return Data.find(res => res);
}

async function getNotConfirmed(){
    return Data.find({$or : [{isConfirmed : false}, {isConfirmed : undefined}]});
}
async function getConfirmed(){
    return Data.find({isConfirmed : true});
}

async function deleteOne(idUser){
    return Data.deleteOne({_id : idUser});
}

async function confirmAuth(idUser){
    return Data.updateOne({_id : idUser}, {isConfirmed : true});
}

async function editEmail(id, email){
    return Data.updateOne({_id : id}, {email});
}



module.exports = {createData,getAll,deleteOne,confirmAuth ,getNotConfirmed,getConfirmed , editEmail}
