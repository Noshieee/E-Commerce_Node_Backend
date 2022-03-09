const mongoose = require('mongoose')

const ROLE ={
  ADMIN: 'admin',
  CUSTOMER: 'customer'
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
    email: {
        type: String,
        required: true,
        unique: true,
      },
    contact: {
        type: String,
        required: true,
      },
    password: {
        type: String,
        required: true,
      },
    role:{
        type: String,
        required: true,
        default: ROLE.CUSTOMER
    },
    joinDate: {
        type: Date,
        required: true,
        default: Date.now,
      },
    cart: {
        type: Array,
        required: false,
        default: [],  
      }
})

module.exports = mongoose.model("User", userSchema);