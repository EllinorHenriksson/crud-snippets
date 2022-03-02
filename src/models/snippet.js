import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  code: {
    type: String,
    required: '`{PATH}` is required!',
    maxlength: [1000, '`{PATH}` must not contain more than ({MAXLENGTH}) characters.'],
    minlength: [3, '`{PATH}` must contain more than ({MINLENGTH}) characters.']
  },
  owner: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

// Create a model using the schema.
export const Snippet = mongoose.model('Snippet', schema)
