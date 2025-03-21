import express, { Request, Response } from "express";
import { User, IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Register
export const register = async (req: Request, res: Response) => {
  const {
    firstname,
    lastname,
    email,
    password,
    gender,
  }: Partial<IUser> = req.body;
  const confirmPassword = req.body.confirmPassword;

  if (
    [
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      gender,
    ].some((elem) => !elem?.trim())
  ) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Please fill in all fields",
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Passwords do not match",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        status: 409,
        message: "Email is already in use",
      });
    }

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password,
      gender,
    });
    if (!newUser) throw new Error("User creation failed");

    return res.status(201).json({
      success: true,
      status: 201,
      message: "User created successfully",
      data: { firstname, lastname, email },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Unexpected error occurred",
      error,
    });
  }
};

// login
export const login = async (req: Request, res: Response) => {
  const { email, password }: Partial<IUser> = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Please fill in all fields",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Invalid password",
      });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY as string,
      { expiresIn: "15d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Logged in successfully",
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Unexpected error occurred",
      error,
    });
  }
};

// logout
export const logout = (req: Request, res: Response) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    return res.status(200).json({
      success: true,
      status: 200,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Unexpected error occurred while logging out",
      error,
    });
  }
};

// updateUser
export const updateUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { firstname, lastname }: Partial<IUser> = req.body;

  if (!firstname && !lastname) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "No updates provided",
    });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { firstname, lastname } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found to update",
      });
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Unexpected error occurred while updating the user",
      error,
    });
  }
};

// delte a user
export const removeUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid user ID",
      });
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Unexpected error occurred while deleting user",
      error,
    });
  }
};

// get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Operation successful",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Unexpected error occurred while fetching users",
      error,
    });
  }
};
