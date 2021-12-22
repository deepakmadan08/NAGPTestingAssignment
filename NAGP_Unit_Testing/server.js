const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const port = 3010
const db = require("./db/CRUDoperations");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Base URL to check Server Status 
app.get('/', (req, res) => {
    console.log(`Base URL Hit - Server is UP and Running.`);
    res.status(200).send("Server is UP and Running.");
})

//Function to check 9 to 5 Weekday 
//Functionality to Add funds 
/* 1.Request must have User id and valid Fund value.
   2.Funds can't be negative.
*/
app.post('/addFund', async (req, res) => {
    console.log('Requested User ID =' + req.body.userID);
    console.log('Requested User fund = ' + req.body.fund);
    let userID=req.body.userID;
    let fund=req.body.fund;
    if (userID!=undefined && fund!=undefined  && fund > 0 ){
       console.log('Valid Request and Parameter, Checking the User ID in Database.');
       const doesUserExist=await getUserByID(userID);
       console.log(doesUserExist);
        if(doesUserExist[0] !=undefined){
            console.log('Updating User with User ID:' + userID + ' Adding Funds ' + fund);
            const user=await addUserFund(userID,fund);
            res.status(200).json({user});
        }
        else{
            res.status(400).json({"error":"No User with this User ID","requestBody": req.body});  
        }
    }else if (fund<0){
        res.status(400).json({"error":"Fund value can not be negative","requestBody": req.body});  
    }else{
        res.status(400).json({"error":"Request has incorrect parameters","requestBody": req.body});  
    }
 })

//API to Buy a company
/* 1.Valid User id 
   2.Valid Company Name
   3.Funds Should be enough for company */

app.post('/buyEquity', async (req, res) => {
if(checkTime()){
    console.log('Requested User ID = ' + req.body.userID);
    console.log('Requested Company Name = ' + req.body.companyName);
    let userID=req.body.userID;
    let companyName=req.body.companyName;
    if (userID!=undefined && companyName!=undefined ){
        // Checking if Company and User exist in database
        const doesCompanyExist=await getCompanyByName(companyName);
        const doesUserExist=await getUserByID(userID);
        let userFund;
        let companyPrice;
        console.log('Finding User with User ID:' + userID + ' Adding Company ' + companyName);
        if(doesCompanyExist[0]==undefined){
            console.log('Company ID does not exist in Database');
            res.status(400).json({"error":"No Company with requested ID","requestBody": req.body});  
        }else if (doesUserExist[0]==undefined ){
            console.log('No User with this ID exist in Database');
            res.status(400).json({"error":"No User with requested ID","requestBody": req.body});  
        }else if (doesCompanyExist!=undefined && doesUserExist!=undefined){
            console.log('Valid User ID:' + userID + ' and Company with name ' + companyName);
            console.log('Checking User Fund with User ID:' + doesUserExist[0].Balance + 'with Company Price' + doesCompanyExist[0].Price );
            userFund=doesUserExist[0].Balance;
            companyPrice=doesCompanyExist[0].Price ;
            console.log('Checking User Fund By Userid = '+ userFund +",Company Price ="+doesCompanyExist[0].Price );
            if(userFund<companyPrice){
                console.log('User fund is less than company Price ');
                res.status(400).json({"error":"User fund is not enough ","requestBody": req.body});  
            }else{
                console.log('User has enough fund to buy equity');
                const user=await deductUserFund(userID,companyPrice);
                //Add compnay to user Companies.
                let isSuccess =await addCompanyToUser(userID,companyName);
                console.log(`Addding company to user `);
                res.status(200).json({"Success":"Request has been processed","requestBody": req.body}); 
            }
        }       
    }else{
        res.status(400).json({"error":"Request has incorrect parameters","requestBody": req.body});  
    }}
else{
    res.status(400).json({"error":"Market is open during Mon-Fri ,9 AM -5 PM","requestBody": req.body});  
    }
  }) 

//API to sell a company
/* 1.Valid User id 
   2.User Should have Company to sell
*/
app.post('/sellEquity', async (req, res) => {
    if(checkTime()){
    console.log('Requested User ID = ' + req.body.userID);
    console.log('Requested Company Name = ' + req.body.companyName);
    let userID=req.body.userID;
    let companyName=req.body.companyName;
    if (userID!=undefined && companyName!=undefined ){
         // Checking if Company and user Exist
         const doesCompanyExist=await getUserCompanyByID(companyName);
         const doesUserExist=await getUserByID(userID);
         let userFund;
         let companyPrice;
         console.log('Finding User with User ID:' + userID + ' and Company by Name ' + companyName);
         if(doesUserExist[0]==undefined){
            console.log('No User with this ID exist in Database');
            res.status(400).json({"error":"No User with requested ID","requestBody": req.body});  
        }else if (doesCompanyExist[0]==undefined ){
            console.log('User doesnt have this company in his list so he cant sell this');
            res.status(400).json({"error":"No Company with requested ID","requestBody": req.body});  
         }else if (doesCompanyExist!=undefined && doesUserExist!=undefined){
            console.log('Valid User ID:' + userID + ' and Company with name ' + companyName); 
            let companyPrice=await getFundByCompanyName(companyName);
            console.log('Company Price'+companyPrice[0].Price);
            const user = await addUserFund(userID,companyPrice[0].Price);
            // Remove company from user List
            let isSuccess=await deletCompanyFromUser(userID,companyName);
            res.status(200).json({"Success":"Request has been processed","requestBody": req.body});  
         }       
    }else{
        res.status(400).json({"error":"Request has incorrect parameters","requestBody": req.body});  
    }
    }else{
        res.status(400).json({"error":"Market is open during Mon-Fri ,9 AM -5 PM","requestBody": req.body});  
}
  }) 

//Function to check if a user exits or not in DB 
function getUserByID(id){
    return db.getUserByID(id);
}

//Add Funds to User Balance
function addUserFund(ID,fund){
    return db.addUserFund(ID,fund);
}

//Deduct Funds from User Balance
function deductUserFund(ID,fund){
    return db.deductUserFund(ID,fund);
}

//Function to check if a company exits or not in DB 
function getCompanyByName(companyName){
    return db.getCompanyByID(companyName);
}

//Function to check if a user has the company to sell
function getUserCompanyByID(companyName){
    return db.getUserCompanyByID(companyName);
}

// Function to get fund of a company
function getFundByCompanyName(companyName){
    return db.getFundByCompanyName(companyName);
}

function addCompanyToUser(userID,companyName){
    return db.addCompanyToUser(userID,companyName);
}

function deletCompanyFromUser(userID,companyName){
    return db.deletCompanyFromUser(userID,companyName);
}

function checkTime(){
    let currentDate=new Date();
    var currentDay = currentDate.getDay();
    var currentHour = currentDate.getHours();
    console.log("is Week Day ? "+currentDay + " "+currentHour)
    var isValidDay = (currentDay >2) || (currentDay  <6); // 6 = Saturday, 0 = Sunday
    console.log("is Week Day ? "+isValidDay)
    isValidTime= currentHour>0 && currentHour<17 ;
    console.log("is 9-5 ? "+isValidTime)
    return (isValidTime && isValidDay );
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports=app;