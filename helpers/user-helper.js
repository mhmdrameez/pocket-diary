const db = require("../config/connection");
const collection = require("../config/collections");
const bcrypt = require('bcrypt');
const { ObjectId } = require("mongodb");

module.exports = {
    doSignup: async (userData) => {
        try {
            userData.Password = await bcrypt.hash(userData.Password, 10);
            const result = await db.get().collection(collection.USER_COLLECTION).insertOne(userData);
            console.log(result.insertedId);
            return result.insertedId;
        } catch (error) {
            throw error; // Forward the error to the caller
        }
    },

    doLogin: async (userData) => {
        try {
            const response = { status: false };
            const user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email });
            if (user) {
                const status = await bcrypt.compare(userData.Password, user.Password);
                if (status) {
                    response.user = user;
                    response.status = true;
                }
            }
            return response;
        } catch (error) {
            throw error; // Forward the error to the caller
        }
    },

    addDetails: async (userid, newData) => {
        try {
            const dataObj = {
                user: ObjectId(userid),
                data: newData
            };
            const result = await db.get().collection(collection.DATA_COLLECTION).insertOne(dataObj);
            console.log(result.insertedId + " inserted");
            return result.insertedId;
        } catch (error) {
            throw error; // Forward the error to the caller
        }
    },

    getAllDetails: async (user) => {
        try {
            const data = await db.get().collection(collection.DATA_COLLECTION).aggregate([
                {
                    $match: { "user": ObjectId(user._id) }
                },
                {
                    $sort: { "data.date": -1 }
                }
            ]).toArray();

            const newd = data.map(item => item.data);
            return newd;
        } catch (error) {
            throw error; // Forward the error to the caller
        }
    },

    getDay: async (date, user) => {
        try {
            const data = await db.get().collection(collection.DATA_COLLECTION).aggregate([
                {
                    $match: {
                        $and: [{ "user": ObjectId(user._id) }, { "data.date": date }]
                    }
                }
            ]).toArray();

            const newd = data.map(item => item.data);
            return newd;
        } catch (error) {
            throw error; // Forward the error to the caller
        }
    },

    getSearch: async (search, user) => {
        try {
            const data = await db.get().collection(collection.DATA_COLLECTION).aggregate([
                {
                    $match: {
                        $and: [{ "user": ObjectId(user._id) }, { "data.content": { $regex: search } }]
                    }
                }
            ]).toArray();

            const newd = data.map(item => item.data);
            console.log(newd);
            return newd;
        } catch (error) {
            throw error; // Forward the error to the caller
        }
    }
};
