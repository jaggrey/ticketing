// HASHING AND COMPARING PASSWORD

// scrypt is a hashing function, great for hashing passwords but the downside to it is that
// it is callback based so we need to promisify the function to use async await
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class PasswordHandler {
  // Signup flow
  static async toHash(password: string) {
    // randomBytes will generate a random string which will be used as a Salt
    const salt = randomBytes(8).toString('hex');
    // scrypt returns a buffer but TS doesn't so we need to wrap await and alias it as a Buffer
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    // Return has 'hashedPassword' concatenated together with a '.' and 'salt'
    // eg. kieyt84ho8u3h8y63hlho8o3h806.somestring
    return `${buf.toString('hex')}.${salt}`;
  }

  // Signin flow
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    // Verification if password matches
    return buf.toString('hex') === hashedPassword;
  }
}
