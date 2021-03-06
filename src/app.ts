require('dotenv').config();
import updateDb from './tmdb_api';
import { scheduleUpdateMovies } from './tasks';
import logger from './logger';

const db_url = process.env.DATABASE_URL;
if (db_url) logger.info(`DB: ${db_url.slice(db_url.indexOf('@') + 1)}`);

const init = async () => {
  updateDb();
  scheduleUpdateMovies();
};

init();
