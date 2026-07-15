import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  ownerId: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  ownerId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

// `mongoose.models.User` is typed as a loosely-typed model when it comes from
// the model registry. Cast it back to the schema's model type so generated
// route handlers keep the query/update overloads for IUser.
const User = (mongoose.models.User as mongoose.Model<IUser> | undefined)
  || mongoose.model<IUser>('User', UserSchema);

export default User;
