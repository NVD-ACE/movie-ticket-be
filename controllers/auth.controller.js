import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const signUp = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { username, password, email, fullName } = req.body;

        // Validate input
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Username, password, and email are required' });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            userName: username,
            password: hashedPassword, // Ensure to hash the password before saving
            email: email,
            fullName: fullName,
        }, { transaction });
        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        await transaction.commit();
        // Respond with user data and token
        res.status(201).json({ message: 'User signed up successfully', token });
    } catch (error) {
        await transaction.rollback();
        console.error('Error during sign up:', error);
        res.status(500).json({ message: 'Error signing up', error: error.message });
        next(error);
    }
}

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message: "Invalid password"});
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({ message: 'User signed in successfully', token, user });        
    } catch (error) {
        res.status(500).json({ message: 'Error signing in', error: error.message });
    }
}

const signOut = async (req, res, next) => {
    try {
        res.status(200).json({ message: 'User signed out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error signing out', error: error.message });
        next(error);
    }
}

export { signUp, signIn, signOut };
