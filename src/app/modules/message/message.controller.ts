import { Request, Response } from "express";
import { Message } from "./message.model";

const createMessage = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const result = await Message.create(payload);
// console.log({result})

    res.status(200).json(result);
  } catch (error) {
    console.log({error})
    res.status(200).json(error);
  }
};

const getMessages = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId;

    const result = await Message.find({ chatId });
    console.log(result);

    res.status(200).json(result);
  } catch (error) {
    res.status(200).json(error);
  }
};

export const MessageController = {
  createMessage,
  getMessages,
}