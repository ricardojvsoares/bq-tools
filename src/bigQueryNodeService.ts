import { ICredentials } from './authService';
import { BigQueryService } from './bigQueryService';
import { ConfigError, readJsonFile } from './cfgUtils';

export class BigQueryNodeService extends BigQueryService {
  public static async create() {
    const gacPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!gacPath) {
      throw new ConfigError(`Unable to load BigQuery credentials`, 'GOOGLE_APPLICATION_CREDENTIALS', undefined);
    }
    const credentials = await readJsonFile<ICredentials>(gacPath);

    return new BigQueryNodeService(credentials);
  }
}
