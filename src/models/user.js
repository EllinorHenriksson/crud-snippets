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

/**
 * Authenticates the user.
 *
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {object} - An object representing the user.
 */
schema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt.')
  }

  return user
}

// Salt and hash password before saving.
schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

// Create a model using the schema.
export const User = mongoose.model('User', schema)
