import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv, { config } from 'dotenv';
import { Chat } from "./chat.model";
import httpStatus from 'http-status';
dotenv.config();

// const Auth = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ success: false, message: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, config.JWT_SECRET as string) as { id: string };
//     req.user = { id: decoded.id }; // ✅ attach to req
//     console.log(req.user?.id);
//     next();
//   } catch (err) {
//     return res.status(401).json({ success: false, message: 'Invalid token' });
//   }
// };

const createChat = async (req: Request, res: Response) => {
  try {
    const initiatorId = req.user?.id; 
    console.log(req.user?.id);

    const { participantIds } = req.body;

    if (!initiatorId || !participantIds || !Array.isArray(participantIds)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Invalid request. Missing participants or user ID.',
      });
    }

    // Ensure initiator is included
    const allParticipantIds = [...new Set([initiatorId, ...participantIds])];

    // Check if chat already exists
    const isExist = await Chat.findOne({
      participants: { $all: allParticipantIds },
    });

    const result = isExist || await Chat.create({ participants: allParticipantIds });

    res.status(httpStatus.OK).json(result);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const userChats = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.find({
      participants: { $in: [req.params.userId] },
    }).populate("participants");

    res.status(200).json(chat);
  } catch (error) {
    res.status(200).json(error);
  }
};

const findChat = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.findOne({
      participants: { $all: [req.params.firstId, req.params.secondId] },
    });

    res.status(200).json(chat);
  } catch (error) {
    res.status(200).json(error);
  }
};

export const ChatController = {
  createChat,
  userChats,
  findChat,
};