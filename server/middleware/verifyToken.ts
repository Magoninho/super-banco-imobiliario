import { RequestParamHandler } from 'npm:express';
import jwt from 'jsonwebtoken';

export const verifyToken: RequestParamHandler = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const _decoded = jwt.verify(token, Deno.env.get("JWT_SECRET"));
        next();
    } catch (_err) {
        return res.status(401).json({ message: 'Token invalido' });
    }
};
