const knex=require("./knex");

function getUserByID(id){
    return knex("userFund").select("Balance").where("userID",id);
}

function getCompanyByID(name){
    return knex("companies").where("Name",name);
}

function getUserCompanyByID(name){
    return knex("userCompanies").select("companyID").where("companyID",name);
}

function addUserFund(id,fund){
return knex("userFund").where('userID', '=', id).increment('Balance', fund)
}

function deductUserFund(id,fund){
    return knex("userFund").where('userID', '=', id).decrement('Balance', fund)
}

function addCompanyToUser(userid,companyName){
    return knex("userCompanies").insert({userid: userid, companyID:companyName});
}

function deletCompanyFromUser(userID,companyName){
return knex("userCompanies").where({userID: userID, companyID:companyName}).del();
}

function getFundByCompanyName(companyName){
    return knex("companies").select("Price").where("Name",companyName);
}

module.exports={
    getUserByID,
    getCompanyByID,
    addUserFund,
    deductUserFund,
    addCompanyToUser,
    deletCompanyFromUser,
    getFundByCompanyName,
    getUserCompanyByID
}