import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ErrorHandler } from '../utils/ErrorHandler';
import { hash, compare } from '../utils/SecurityUtils';
import { transporter, emailOptions, sendEmail } from '../utils/Email';
import randomatic from 'randomatic';
import { IToken } from '../interface/IVerifyToken';
import { IUser } from '../interface/IUser';
import { IGoogleUser } from '../interface/IGoogleUser';
import { IData } from '../interface/IUserData';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// generate a jwt for authentication
const generateToken = async (req: Request, res: Response, id: string) => {
  const jwtSecret = process.env.JWT as string;
  const token = await jwt.sign({ id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    sameSite: 'none' as const,
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    secure: true,
    path: '/',
    domain: 'localhost',
  };

  res.cookie('jwt', token, cookieOptions);

  return token;
};
// verify token
const verifyToken = async (token: string) => {
  const decoded = await jwt.verify(token, process.env.JWT as string);
  return decoded;
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.userEmail;

    // check the email is found previously
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      return res.status(400).render('signup', {
        title: 'Sign up',
        message: 'This Email is already found, try Again...!',
      });
    }

    // hashing user password before storing it
    const hashedPassword = await hash(req.body.password as string);

    const role = req.body.role;

    // extract data from request body
    const fullName = req.body.firstName + ' ' + req.body.lastName;
    const data: IData = {
      name: fullName,
      email: req.body.userEmail,
      relativeEmail: req.body.relativeEmail,
      password: hashedPassword,
      age: req.body.age,
      address: req.body.address,
      role,
      resetPasswordUpdatedAt: new Date(),
    };

    if (role === 'doctor') {
      data.title = req.body.title;
      data.phone = req.body.phone;
      data.idVerificationImg = req.file?.filename;
    }

    const newUser = await prisma.user.create({ data });

    // generate token with user id
    const token = await generateToken(req, res, newUser.id);

    // res.status(201).json({
    //   status: 'you are logged in successfully!.',
    //   token,
    //   user,
    // });

    res.status(200).redirect('/home');
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get user data from request body to authenticate using it
    const email = req.body.email;
    const password = req.body.password;

    // check if the user input the username or email with the password
    if (!email || !password) {
      return res.status(400).render('login', {
        title: 'Login',
        message: 'Please fill all fields then try Again...!',
      });
    }
    // find user if registered or not
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).render('login', {
        title: 'Login',
        message: 'Email or Password are not correct..!, Try Again!',
      });
    }
    // check if the password is correct or not
    const verifyPassword = await compare(password, user.password);
    if (!verifyPassword) {
      return res.status(401).render('login', {
        title: 'Login',
        message: 'Email or Password are not correct..!, Try Again!',
      });
    }
    // generate token with user id)
    const token = await generateToken(req, res, user.id);

    // res.status(200).json({
    //   status: 'you are logged in successfully!.',
    //   token,
    // });
    res.status(200).redirect('/home');
  }
);
export const loginWithGoogle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the email from google
    const userEmail = (req.user as unknown as IGoogleUser).emails[0].value;

    // get the user id
    const user = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });

    // check if user not found
    if (!user) {
      return next(
        new ErrorHandler(401, 'This account is not found, Try Again!')
      );
    }
    // create a token using user id
    const token = await generateToken(req, res, user.id);

    console.log(token);

    // redirect user to home page
    res.status(200).redirect('/home');
  }
);

// check if the password is changed after the token signed
const checkIfPasswordChangedAfterToken = (
  userPasswordDate: number,
  tokenDate: number
) => userPasswordDate <= tokenDate;

// check if the user login and have authentication or not
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if there is a jwt in cookie

    if (!req.cookies.jwt) {
      return next(
        new ErrorHandler(401, 'You are not login, Login and Try Again')
      );
    }

    const token = req.cookies.jwt;

    //verify current token
    const decoded = await verifyToken(token);
    const userId = (decoded as IToken).id;

    // check if there is a  user with user id
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return next(
        new ErrorHandler(401, 'User with the current token is nolonger found!.')
      );
    }
    // check if the password is changed after token added
    const userChangedPasswordAt = new Date(user.resetPasswordUpdatedAt);
    const userChangedPasswordAtAsNumber = Math.floor(
      userChangedPasswordAt.getTime() / 1000
    );
    if (
      !checkIfPasswordChangedAfterToken(
        userChangedPasswordAtAsNumber,
        (decoded as IToken).iat
      )
    ) {
      return next(
        new ErrorHandler(
          401,
          'Password is changed, session time out, Please Login Again!.'
        )
      );
    }
    // store user in request to be accessible
    req.user = user;

    next();
  }
);

export const isLoggedin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check if there is a jwt in cookie
  if (req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;

      //verify current token
      // const decoded = await jwt.verify(token, process.env.JWT as string);
      const decoded = await verifyToken(token);
      if (!decoded) {
        return next();
      }

      const userId = (decoded as IToken).id;

      // check if there is a  user with user id
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return next();
      }
      // check if the password is changed after token added
      const userChangedPasswordAt = new Date(user.resetPasswordUpdatedAt);
      const userChangedPasswordAtAsNumber = Math.floor(
        userChangedPasswordAt.getTime() / 1000
      );
      if (
        !checkIfPasswordChangedAfterToken(
          userChangedPasswordAtAsNumber,
          (decoded as IToken).iat
        )
      ) {
        return next();
      }
      // store user in request to be accessible
      res.locals.user = user;
    } catch (error) {
      return next();
    }
  }
  next();
};
// check if there is a session to prevent rendering login page
export const isOnSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if there is a jwt (user session)
    const token = req.cookies.jwt;
    if (token) {
      const decoded = await verifyToken(token);
      const user = await prisma.user.findFirst({
        where: {
          id: (decoded as IToken).id as string,
        },
      });
      if (user) {
        return res.status(200).redirect('/home');
      } else {
        return res.status(200).render('home', {
          title: 'Home',
        });
      }
    } else {
      return res.status(200).render('home', {
        title: 'Home',
      });
    }
  }
);

// check if the user authorized to do something
export const restrictTo = (...role: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!role.includes((req.user as IUser).role)) {
      return next(
        new ErrorHandler(
          403,
          'You do not have permission to perform this action'
        )
      );
    }
    next();
  };
};
// logout user from the current session
export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    res.status(200).render('home', {
      title: 'Home',
    });
  }
);

export const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email as string;

    // get the user by its email
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return next(
        new ErrorHandler(401, 'User with entered email is not found!.')
      );
    }
    // create a random hashed token to verify user by it
    const token = await bcrypt.hash(email, 12);

    // store the hashed token
    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        resetPasswordToken: token,
      },
    });

    //form the options of the email
    emailOptions.to = user.email;
    emailOptions.text = `use this url to reset your password http://127.0.0.1:3000/reset-password/:${token} , Please make sure to never share this link with any one ,You have only 10 minutes to reset your password..!`;
    emailOptions.html = `<p>use this url to reset your password <a="http://127.0.0.1:3000/reset-password/:${token}">http://127.0.0.1:3000/reset-password/:${token}</a> , Please make sure to never share this link with any one ,You have only 10 minutes to reset your password..!</p>`;

    // send email to the user gmail
    await sendEmail(transporter, emailOptions);

    res.status(200).render('checkEmail', {
      title: 'Email Sent',
    });
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the hashed user from the form
    const token = req.body.token as string;

    // get the user by the hashed token
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });

    console.log(user);

    if (!user) {
      return next(
        new ErrorHandler(400, 'This Reset Password Token is not correct!1')
      );
    }
    // hashing password before updating it
    const hashedPassword = await hash(req.body.password as string);

    // reset the user password
    const updatedUserPassword = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetPasswordToken: 'null' },
    });

    // redirect user to login using his new password
    res.redirect('/login');
  }
);

// check if the user input relative email before enter to models
export const checkIfHaveRelativeEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the user from req
    const user = await prisma.user.findFirst({
      where: {
        id: req.user?.id as string,
      },
    });

    // if the current user doesn't have a relative email force him to enter one
    if (!user?.relativeEmail) {
      return res.status(400).render('inputRelativeEmail', {
        title: 'Enter Relative Email',
      });
    }
    next();
  }
);
