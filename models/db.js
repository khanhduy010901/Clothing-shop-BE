require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://vnnnsao1:kYpJEAO91IJpWw3q@t6ngl4m.8galv0j.mongodb.net/mOv_te_f_tztf?retryWrites=true&w=majority&appName=mOx652024")
    .then(() => {
        console.log("CONNECT MONGODB ATLAS SUCCESSFULLY");
    })
    .catch((err) => {
        console.log('ERROR CONNECT MONGODB ATLAS');
        console.log(err);
    });

module.exports = { mongoose };