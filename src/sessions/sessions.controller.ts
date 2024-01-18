import { inject, singleton } from 'tsyringe';
import { Request, Response } from 'express';

import { HttpError } from '@/errors/http-error.class';
import { SessionsService } from '@/sessions/sessions.service';
import { sessionResponseSchema } from '@/sessions/dto/response-session.dto';

@singleton()
export class SessionsController {
  constructor(
    @inject(SessionsService) private sessionsService: SessionsService,
  ) {}

  async getOne(req: Request, res: Response) {
    const { key } = req.params;
    if (!key) throw new HttpError(401, 'You are not logged in!');
    const session = await this.sessionsService.getSessionByKey(key as string);
    const dto = sessionResponseSchema.parse(session);
    return res.json(dto);
  }
}
