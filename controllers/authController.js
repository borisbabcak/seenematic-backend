import authService from '../services/authService.js';
import { validationResult } from 'express-validator';

export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }

    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }

    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const result = await authService.getProfile(req.user._id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};