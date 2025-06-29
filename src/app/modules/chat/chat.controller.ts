import { Request, Response } from 'express';
import { Chat } from './chat.model';  // Ensure the model is imported correctly
import httpStatus from 'http-status';

const createChat = async (req: Request, res: Response) => { 
  try {
    const initiatorId = req.user?.id;
    const { participantIds } = req.body;
    if (!initiatorId || !participantIds || !Array.isArray(participantIds)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Invalid request. Missing participants or user ID.',
      });
    }
    const allParticipantIds = [...new Set([initiatorId, ...participantIds])];
    const isExist = await Chat.findOne({ participants: { $all: allParticipantIds } });
    const result = isExist || await Chat.create({ participants: allParticipantIds });
    res.status(httpStatus.OK).json(result);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const userChats = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.find({ participants: { $in: [req.params.userId] } }).populate("participants");
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

const findChat = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.findOne({
      participants: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const ChatController = {
  createChat,
  userChats,
  findChat,
};
