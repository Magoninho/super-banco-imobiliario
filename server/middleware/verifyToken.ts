import express, { RequestHandler, RequestParamHandler } from 'npm:express';
import jwt from 'jsonwebtoken';
import process from "node:process";

export const verifyToken: RequestParamHandler = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token invalido' });
    }
};
