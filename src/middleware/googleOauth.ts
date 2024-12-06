import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { IProfile } from '../interface/IProfile';
import { hash } from '../utils/SecurityUtils';

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      // check if the user already registered
      const email = (profile as IProfile).emails[0].value;
      const userIsFound = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      // if the user found login
      if (userIsFound) return done(null, profile);

      // if the user is not found signup user
      const name = (profile as IProfile).displayName;


      // hashing password
      const password = await hash(process.env.DEFAULT_USER_PASSWORD as string);

      // register with user data
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });
      console.log(user);
      return done(null, profile);
    }
  )
);
export default passport;
