import mongoose from 'mongoose';
import { PasswordHandler } from '../utils/passwordHandler';

// An interface that describes the properties that are required to
// create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// schema tells Mongoose all the properties a user is going to have
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    // Transform the properties in the db
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

// Middleware function implemented in mongoose use the 'save' hook. Executes when we try to save
// something the DB.
// Moongoose like express uses the old way doing things doesnt out of the box support async await
// syntax. To handle asynchronous code we need to pass done and invoke it when we done with the
// implementation.
// Using function keyword is to bind this to the context of the particular document in Mongoose
// and not this implementation or object.
userSchema.pre('save', async function (done) {
  // Check to see if password is modified.
  if (this.isModified('password')) {
    const hashed = await PasswordHandler.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// statics allow us to get a custom function built into a model, in this case 'build'
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
