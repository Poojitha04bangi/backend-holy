import secrets from '@/config/secrets';
import User from '@/models/users/user.model';
import { sendSMS, verifyOTP } from '@/services/twilio.services';
import { UserStatus } from '@/typings/enums';
import cookieToken from '@/utils/cookie-token';
import CoffeeError from '@/utils/custom-error';
import toIND from '@/utils/to-ind';
import { NextFunction, Request, Response } from 'express';

type P = {
  rq: Request;
  rs: Response;
  n: NextFunction;
};

/**
 * Find All Users
 * @param req
 * @param res
 * @param next
 */

export const getAllUsers = async (req: P['rq'], res: P['rs']) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};
/**
 * Find User by ID
 * @param req
 * @param res
 * @param next
 */
export const getUserById = async (req: P['rq'], res: P['rs']) => {
  try {
    const user = await User.findById({ _id: req.params.user_id });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Update User by ID
 * @param req
 * @param res
 */

export const updateUserById = async (req: P['rq'], res: P['rs']) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.user_id },
      req.body,
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Delete User by ID
 * @param req
 * @param res
 * @param next
 */
export const deleteUserById = async (req: P['rq'], res: P['rs']) => {
  try {
    const user = await User.deleteOne({ _id: req.params.user_id });
    res.status(200).json({
      ...user,
      message: 'User Deleted Successfully',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
/**
 * Sign Up User
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const signUp = async (req: P['rq'], res: P['rs'], next: P['n']) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password) {
    return next(new CoffeeError('Required', 400));
  }
  try {
    const existsUser = await User.findOne({ phone });
    if (existsUser) {
      return res.status(400).json({
        success: false,
        message: 'User Already Exists',
      });
    }

    /**
     * For Sending OTP to the user phone
     */
    const india = toIND(phone);
    await sendSMS(india);
    const user = await User.create({
      name,
      phone,
      password,
    });
    /**
     * Setting JWT Token as Cookie
     */
    const token = await user.getJwtToken();
    await cookieToken(res, {
      value: token,
      secret: secrets.token,
    });
    const payload = {
      success: true,
      message: 'User Created Successfully',
      user,
      token,
    };
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json(error);
  }
};
/**
 * Confirm OTP
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const confirmOTP = async (req: P['rq'], res: P['rs'], next: P['n']) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return next(new CoffeeError('OTP is required', 400));
  }
  try {
    const india = toIND(phone);
    const response = await verifyOTP(india, otp);
    if (response.status === UserStatus.APPROVED) {
      const user = await User.findOneAndUpdate(
        { phone },
        { status: UserStatus.APPROVED },
        { new: true }
      );

      user.save();
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
/**
 * Sign In User
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const signIn = async (req: P['rq'], res: P['rs'], next: P['n']) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return next(new Error('Email and password Required '));
    }
    const user = await User.findOne({ phone }).select('+password');
    console.log({ user });
    if (!user) {
      return next(new Error('Email and password not matched '));
    }
    const isCorrectPassword = await user.checkValidPassword(password);
    if (!isCorrectPassword) {
      return next(new Error('Not Registered User'));
    }
    if (user.status !== UserStatus.APPROVED) {
      const payload = {
        success: false,
        message: 'User Not Approved',
      };
      return res.status(401).json(payload);
    }

    /**
     * Setting JWT Token as Cookie
     */
    const token = await user.getJwtToken();
    await cookieToken(res, {
      value: token,
      secret: secrets.token,
    });
    const _user = {
      // @ts-expect-error
      ...user._doc,
      password: undefined,
    };
    const payload = {
      success: true,
      message: 'Login Successfully',
      user: _user,
      token,
    };
    res.status(200).json(payload);
  } catch (err) {
    res.status(500).json(err);
  }
};
/**
 * Log Out User
 * @param req
 * @param res
 * @param next
 */
export const logOut = async (req: P['rq'], res: P['rs'], next: P['n']) => {
  try {
    await cookieToken(res, {
      value: null,
      secret: secrets.token,
      options: {
        expires: new Date(Date.now()),
        httpOnly: true,
      },
    });
    const payload = {
      success: true,
      message: 'Logout User Successfully',
    };
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json(error);
  }
};
/**
 * Forget Password
 */
export const forgetPassword = async (
  req: P['rq'],
  res: P['rs'],
  next: P['n']
) => {
  const { phone } = req.body;
  if (!phone) {
    return next(new Error('Email Required'));
  }
  const user = await User.findOne({ phone });
  console.log({ user });
  if (!user) {
    return next(new Error('Email and password not matched '));
  }
  const india = toIND(phone);
  await sendSMS(india);
  // const token = await user.getForgetPasswordToken();
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: 'Reset Password OTP Sent to your Phone',
  });
};
/**
 * Reset Password
 */

export const resetPassword = async (
  req: P['rq'],
  res: P['rs'],
  next: P['n']
) => {
  try {
    const { phone, password, otp } = req.body;

    if (!password) {
      return next(new Error('Password Required'));
    }
    if (!otp) {
      return next(new Error('OTP Required'));
    }
    if (!phone) {
      return next(new Error('Phone Required'));
    }
    const india = toIND(phone);
    const response = await verifyOTP(india, otp);
    if (response.status === UserStatus.APPROVED) {
      const user = await User.findOne({
        phone,
      });

      if (!user) {
        return next(new Error('Invalid Token'));
      }
      user.password = password;
      user.forgetPasswordToken = undefined;
      user.forgetPasswordExpiry = undefined;
      await user.save();
      /**
       * Setting JWT Token as Cookie
       */
      const _token = await user.getJwtToken();
      await cookieToken(res, {
        value: _token,
        secret: secrets.token,
      });
      const payload = {
        success: true,
        message: 'Password Reset Successfully',
      };
      res.status(200).json(payload);
    }
    if (response.status !== UserStatus.APPROVED) {
      return next(new Error('Invalid OTP'));
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
