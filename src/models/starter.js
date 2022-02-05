import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: ''
  }
})

UserSchema.methods.method = (a, b) => {
  return true
}

mongoose.model('User', UserSchema)