import { Request, Response } from 'express';
import { handleAsync } from '../../utils/handleAsync';
import { participantService } from './participant.service';
import { sendResponse } from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createParticipant = handleAsync(async (req: Request, res: Response) => {
  req.body.user = req.user!._id;
  const result = await participantService.createParticipant(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Participant successfully created',
    data: result,
  });
});

const getAllParticipant = handleAsync(async (req: Request, res: Response) => {
  const query = { ...req.query, userId: req.user!._id.toString() };
  const result = await participantService.getAllParticipant(query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Participants retrieved successfully',
    data: result,
  });
});

const getParticipantById = handleAsync(async (req: Request, res: Response) => {
  const result = await participantService.getParticipantById(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Participant retrieved successfully',
    data: result,
  });
});

const updateParticipant = handleAsync(async (req: Request, res: Response) => {
  const result = await participantService.updateParticipant(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Participant updated successfully',
    data: result,
  });
});

const deleteParticipant = handleAsync(async (req: Request, res: Response) => {
  const result = await participantService.deleteParticipant(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Participant deleted successfully',
    data: result,
  });
});

const checkParticipant = handleAsync(async (req: Request, res: Response) => {
  req.body.userId = req.user!._id;
  const result = await participantService.checkParticipant(req.body);
  console.log(result);

  sendResponse(res, {
    statusCode: result.statusCode,
    success: true,
    message: result.message,
    data: result.data,
  });
});

export const participantController = {
  createParticipant,
  getAllParticipant,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
  checkParticipant,
};
