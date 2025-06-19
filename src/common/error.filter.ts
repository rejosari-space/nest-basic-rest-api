import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      response.status(400).json({
        errors:
          exception.errors.map((err) => ({
            message: err.message,
          })) || 'Validation error',
      });
    } else {
      response.status(500).json({
        errors: exception.message || 'something went wrong',
      });
    }
  }
}
