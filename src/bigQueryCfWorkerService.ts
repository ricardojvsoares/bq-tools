import { AuthService } from './authService';
import { BigQueryService } from './bigQueryService';

export class BigQueryCFWorkerService extends BigQueryService {
  constructor(encodedCredentials: string) {
    super(AuthService.decodeCredentials(encodedCredentials));
  }
}
