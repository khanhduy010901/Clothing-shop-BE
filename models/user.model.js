var db = require('./db');
var userSchema = new db.mongoose.Schema(
    {
        FullName: { type: String, required: true },
        Email: { type: String, required: true, unique: true },
        PhoneNumber: { type: String, required: true },
        Password: { type: String, required: true },
        RegistrationDate: { type: Date, required: true  }
    },
    { collection: 'users' }
);


let userModel = db.mongoose.model('userModel', userSchema);

module.exports = { userModel };