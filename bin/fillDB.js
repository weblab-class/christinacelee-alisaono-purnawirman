/* This is to fill the fake data in the database */

// get the User, trip, and destination model
var User = require('../schemas/user');
var Trip = require('../schemas/trip');
var Destination = require('../schemas/destination');
var chalk = require('chalk')
var isIDExist = function(Model, IDName, IDValue){
    Model.findOne({IDName: IDValue}, function(err, record){
      if(err){
        console.log(chalk.red("error in finding " + IDName));
      }
      if(record != null){
        return true;
      }
    });
    return false;
  }

var _findAndAddToList = function(Model, IDName, IDValue, fieldName, newElement){
    // TODOL: for some reason _updateField function is not recognized, so brute force here
    Model.findOne({IDName: IDValue}, function(err, record){
      if(err){
        console.log(chalk.red("Error in update for " + IDName));
        return false;
      }
      if(record == null){
        console.log(chalk.red(IDName + " record does not exist"));
        return false;
      } else {
        var newFieldValue = record[fieldName];
        // if element does not exist in the list, then add it
        if(newFieldValue.indexOf(newElement) < 0){
          newFieldValue.push(newElement);
        }
        if(!this._updateField(Model, IDName, IDValue, fieldName, newFieldValue)){
          return false;
        }
      }
    });
    return true;
  }

var uniquePush = function(list, newElement){
  if(list.indexOf(newElement) < 0){
    list.push(newElement);
  }
}
// /* Adding new destination to database */
// var _addNewDestination = function(destinationInfo){
//   Destination.findOne()
// }

// /* Deleting destination in database */
// var _deleteDestination = function(destinationInfo){
  
// }
module.exports = {
  /* check if user exist in database */
  checkModule: function(){
    console.log('working~');
  }
  ,
  isIDExist: function(Model, IDName, IDValue){
    Model.findOne({IDName: IDValue}, function(err, record){
      if(err){
        console.log(chalk.red("error in finding " + IDName));
      }
      if(record != null){
        return true;
      }
    });
    return false;
  }
  ,
  /* 
  Adding new user to the database, return the user if success, null otherwise
  */
  addNewUser: function(User, userInfo){
    var chalk = require('chalk');
    // check if userID already exist
    if(isIDExist(User, "userID", userInfo.userID)){
      console.log(chalk.red("user already exist, can not add new user"));
      return null;
    }
    
    // if not existed before, create a new user
    var newUser = new User(userInfo);
    newUser.save();
    return newUser;
  }
  ,
  /* helper function to update one field in user profile */
  _updateField: function(Model, IDName, IDValue, fieldName, fieldValue){
    var chalk = require('chalk');
    Model.update({IDName: IDValue}, {$set : {fieldName: fieldValue}},
      function(err, result){
        if(err){
          console.log(chalk.red("error in updating Model with ID type of: "
                                + IDName + " for field: " + fieldName));
          return false;
        }
      });
    return true;
  }
  ,
  /* 
  Editing user profile to the database, return true if success, false otherwise
  editing user profile is restricted to changing information related to users only
  e.g. can only edit userName, userPhoto, userDescription
  */
  editUserProfile: function(User, userInfo){
    var chalk = require('chalk');
    // update user profile
    User.findOne({'userID': userInfo.userID}, function(err, user){
      if(err){
        console.log(chalk.red("Error in editUserProfile"));
        return false;
      }
      if(user === null){
        console.log(chalk.red("user does not exist"));
        return false;
      } else {
        // update each field if it exist in userInfo
        var fieldNameList = ["userName", "userPhoto", "userDescription", "userEmail"];
        var fieldName;
        for(fieldName in fieldNameList){
          if(userInfo.hasOwnProperty(fieldName)){
            if(!this._updateField(User, "userID", user.userID, fieldName, userInfo[fieldName]))
            {
              return false;
            }
          }
        }
      }
    });
    return true;
  }
  ,

  /* helper function find and add element list */
  _findAndAddToList: function(Model, IDName, IDValue, fieldName, newElement){
    // TODOL: for some reason _updateField function is not recognized, so brute force here
    Model.findOne({IDName: IDValue}, function(err, record){
      if(err){
        console.log(chalk.red("Error in update for " + IDName));
        return false;
      }
      if(record == null){
        console.log(chalk.red(IDName + " record does not exist"));
        return false;
      } else {
        var newFieldValue = record[fieldName];
        // if element does not exist in the list, then add it
        if(newFieldValue.indexOf(newElement) < 0){
          newFieldValue.push(newElement);
        }
        if(!this._updateField(Model, IDName, IDValue, fieldName, newFieldValue)){
          return false;
        }
      }
    });
    return true;
  },
  /* helper function find and add element list */
  _findAndAddToUserList: function(IDValue, fieldName, newElement){
    // TODOL: for some reason _updateField function is not recognized, so brute force here
    User.findOne({"userID": IDValue}, function(err, record){
      if(err){
        console.log(chalk.red("Error in update for users"));
        return false;
      }
      if(record == null){
        console.log(chalk.red("user record does not exist"));
        return false;
      } else {
        var newFieldValue = record[fieldName];
        // if element does not exist in the list, then add it
        if(newFieldValue.indexOf(newElement) < 0){
          newFieldValue.push(newElement);
        }
        if(!this._updateField(User, "userID", IDValue, fieldName, newFieldValue)){
          return false;
        }
      }
    });
    return true;
  }
  ,

  removeAllOccurenceFromList: function(list, elementToRemove){
    for(var k = list.length - 1; k >= 0; k--){
      if(list[k] === elementToRemove){
        list.splice(k, 1);
      }
    }
  }
  ,

  /* helper function find and remove element from list */
  _findAndRemoveFromList: function(Model, IDName, IDValue, fieldName, elementToRemove){
    Model.findOne({IDName: IDValue}, function(err, record){
      if(err){
        console.log(chalk.red("Error in update for " + IDName));
        return false;
      }
      if(record == null){
        console.log(chalk.red(IDNAME + " record does not exist"));
        return false;
      } else {
        var newFieldValue = record[fieldName];
        removeAllOccurenceFromList(newFieldValue, elementToRemove);
        if(!this._updateField(Model, IDName, IDValue, fieldName, newFieldValue)){
          return false;
        }
      }
    });
    return true;
  }
  ,

  /* likes a trip, true if success, false otherwise 
  User: userLikedTrips, userDestinations
  Trip: tripLikedUsers
  Destination: buddies */
  likeTrip: function(User, Trip, Destination, userID, tripID, destinationID){
    var chalk = require('chalk');
    
    if(!_findAndAddToList(Trip, "tripID", tripID, "tripLikedUsers", userID) ||
       !_findAndAddToList(User, "userID", userID, "userLikedTrips", tripID) ||
       !_findAndAddToList(User, "userID", userID, "userDestinations", destinationID) ||
       !_findAndAddToList(Destination, "destinationID", destinationID, "buddies", userID)){
      return false;
    }
    return true;
  }
  ,

  /* disliking trip, true if success, false otherwise 
  User: userLikedTrips, userDestinations
  Trip: tripLikedUsers
  Destination: buddies */
  dislikeTrip: function(User, Trip, Destination, userID, tripID, destinationID){
    var chalk = require('chalk');
    
    // update Trip
    if(!_findAndRemoveFromList(Trip, "tripID", tripID, "tripLikedUsers", userID) ||
       !_findAndRemoveFromList(User, "userID", userID, "userLikedTrips", tripID) ||
       !_findAndRemoveFromList(User, "userID", userID, "userDestinations", destinationID) ||
       !_findAndRemoveFromList(Destination, "destinationID", destinationID, "buddies", userID)){
      return false;
    }
    return true;
  }
  ,

  /* Deleting user to the database, return true if success, false otherwise
  Trip: remove all trips created by user*/
  deleteUser: function(User, Trip, Destination, userID){
    var chalk = require('chalk');
    
    return true; 
  }
  ,

  /* Adding trips created by an user to the database, return true if succesful
  Trip
  User: userCreatedTrips, userDestinations
  Destination: new or just tabies, buddies */
  addTrip: function(User, Trip, tripInfo){
    var chalk = require('chalk');
    var requiredFields = ["tripID", "tripName", "tripCreatorID", "tripCreatorName", "tripDestinationID", "tripDestinationName", "tripType"];
    var fieldName;
    // for(fieldName in requiredFields){
    for (var k = 0; k < requiredFields.length; k++){
      if(!tripInfo.hasOwnProperty(requiredFields[k])){
        console.log(chalk.red("incomplete input fields for add trip"));
        return "incomplete input fields for add trip";
      }
    }
    if(isIDExist(Trip, "tripID", tripInfo.tripID)){
      console.log(chalk.red("trip already exist, can not add new trips"));
      return "trip already exist, can not add new trips";
    }

    // if not existed, add new trip
    var newTrip = new Trip(tripInfo);
    newTrip.save();
    // update user
    var query = User.
                findOne({}).
                where("userID").eq(tripInfo.tripCreatorID)
    query.exec(function(err, user){
      if(err) console.log("Error in updating users for add trip");
      if(user != null){
        user['userCreatedTrips'].push(tripInfo.tripID);
        user['userLikedTrips'].push(tripInfo.tripID);
        uniquePush(user['userDestinations'], tripInfo.tripDestinationID);
        user.save();
        // console.log(chalk.red(JSON.stringify(user)));
      } else {
        console.log(chalk.red(tripInfo.tripCreatorID + " user not found!"));
      }
      // update destination
        var queryDest = Destination.findOne({}).
                        where("destinationID").eq(tripInfo.tripDestinationID);
        queryDest.exec(function(err, dest){
          if(err) console.log("Error in updating destination for add trip");
          if(dest === null){
            var newDestination = new Destination({"destinationID": tripInfo.tripDestinationID,
                                                  "destinationName": tripInfo.tripDestinationName,
                                                  "tabies": [tripInfo.tripID],
                                                  "buddies": [tripInfo.tripCreatorID]});
            newDestination.save();
          } else {
            uniquePush(dest['tabies'], tripInfo.tripID);
            uniquePush(dest['buddies'], tripInfo.tripCreatorID);
            dest.save()
          }
        });
      return "update success";
    });


  }
  ,
  /* Editing trips to the database 
  Editing trips to the database, return true if success, false otherwise
  editing trips is restricted to changing information related to trips only
  e.g. can only edit tripName, tripType, tripActive, tripPhoto, tripDescription, tripSeason, tripDuration, tripBudget
  */
  editTrip: function(tripInfo){

  }
  ,
  
  /* Deleting trips to the database */
  deleteTrip: function(tripID, tripName, tripCreator, tripDestination, tripType, tripInfo){

  }
}

// var userSchema = new mongoose.Schema({
//   userID: {type: String, required: true, index: {unique: true}},
//   userName: {type: String, required: true},
//   userPhoto: String,
//   userDescription: String,
//   userDestinations: [String],
//   userLikedTrips: [String],
//   userCreatedTrips: [String],
// });



// // test addNewUser
// var testAddNewUser1 = {
//   "userID": "testAddNewUser1",
//   "userName": "testAddNewUser1",
//   "userPhoto": "http://placekitten.com/g/200/200",
// }
// addNewUser(testAddNewUser1);




