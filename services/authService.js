import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class AuthService {
    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }

    async registerUser({ name, email, password }) {
        try {
            const existingName = await User.findOne({ name });
            if (existingName) {
                throw new Error('Name already in use');
            }

            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                throw new Error('Email already in use');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
            });

            const token = this.generateToken(user._id);

            return {
                success: true,
                message: 'User registered successfully',
                token,
                user: user.toJSON()
            };
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    }

    async loginUser({ email, password }) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Email not found');
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                throw new Error('Invalid password');
            }

            const token = this.generateToken(user._id);

            return {
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            };
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    }

    async getProfile(userId) {
        try {
            const user = await User.findById(userId).select('-password');
            if (!user) {
                throw new Error('User not found');
            }

            return {
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch profile');
        }
    }

    async verifyToken(token) {
        try {
            if (!token) {
                throw new Error('No token provided');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}

export default new AuthService();