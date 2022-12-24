var db = require("../config/connection");
var collection = require("../config/collections");
var bcrypt = require('bcrypt');
const { response } = require("express");
const { ObjectId } = require("mongodb");

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertedId)
                console.log(data.insertedId)
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {

                        response.user = user
                        response.status = true
                        resolve(response)

                    } else {
                        console.log("Fail")
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("wrong email")
                resolve({ status: false })
            }
        })
    },
    addDetails: (userid, newData) => {
        return new Promise(async (resolve, reject) => {

            let dataObj = {
                user: ObjectId(userid),
                data: newData
            }
            db.get().collection(collection.DATA_COLLECTION)
                .insertOne(dataObj)
                .then(() => {
                    resolve()
                    console.log(data + "inserted")

                })
                .catch(err => {

                })
        })

    },
    getAllDetails: (user) => {
        return new Promise(async (resolve, reject) => {
            let newd = []
            let data = await db.get().collection(collection.DATA_COLLECTION).aggregate(
                [   {
                        $match: { "user": ObjectId(user._id) }
                    },
                    { 
                        $sort : { "data.date" : -1 }
                    }
                ]

            ).toArray()

            data.forEach((item) => {
                newd.push(item.data)
            });
            //newd = 'data' pushed to an array
            resolve(newd)
        })
    },
    getDay: (date, user) => {
        return new Promise(async (resolve, reject) => {
            let newd = []
            let data = await db.get().collection(collection.DATA_COLLECTION).aggregate(
                [{
                    $match:
                    {
                        $and: [{ "user": ObjectId(user._id) }, { "data.date": date }]
                    }
                }]
            ).toArray()
            

            data.forEach((item) => {
                newd.push(item.data)
            });

            
            resolve(newd)

        })

    },
    getSearch: (search, user) => {
        return new Promise(async (resolve, reject) => {
            let newd = []
            let data = await db.get().collection(collection.DATA_COLLECTION).aggregate(
                [{
                    $match:
                    {
                        $and: [{ "user": ObjectId(user._id) }, { "data.content": { $regex: search } }]
                    }
                }]
            ).toArray()

            data.forEach((item) => {
                newd.push(item.data)
            });
            
            console.log(newd)
            resolve(newd)
        })
    }

}