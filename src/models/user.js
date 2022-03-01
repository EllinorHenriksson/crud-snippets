import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Create a schema.
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'The password must be at least 10 characters long.'],
    maxlength: [1000, 'The password must not be longer than 1000 characters.']
  }
}, {
  timestamps: true
})

// Salt and hash password before saving.
schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

// Create a model using the schema.
export const User = mongoose.model('User', schema)
