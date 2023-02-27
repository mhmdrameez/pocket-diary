const mongoClient = require('mongodb').MongoClient
const state = {
    db:null
}

module.exports.connect=(done)=>{
//     const url = 'mongodb://localhost:27017'
    const url = 'mongodb+srv://mhmdrameez:1@cluster0.mkbor.mongodb.net/?retryWrites=true&w=majority'
   
    const dbname = 'journal'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    })
}
module.exports.get=()=>{
    return state.db
}
