import mongoose from 'mongoose'

const userAdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)

const UserAdminModel = mongoose.model('user_admin', userAdminSchema)
export default UserAdminModel
