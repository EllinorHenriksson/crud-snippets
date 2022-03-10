import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Create a schema.
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: '`{PATH}` is required!',
    maxlength: [30, '`{PATH}` must not be longer than {MAXLENGTH} characters.'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: '`{PATH}` is required!',
    minlength: [10, '`{PATH}` must be at least {MINLENGTH} characters long.'],
    maxlength: [1000, '`{PATH}` must not be longer than {MAXLENGTH} characters.']
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
