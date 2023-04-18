import { Prisma } from '@prisma/client';
import { pick } from 'lodash';
import { PersonResponse } from '../../services/tmdb/types/responses';

const isValidPerson = (person: PersonResponse) => {
  return true;
};

export const parsePerson = (data: PersonResponse) => {
  if (!isValidPerson(data)) {
    return undefined;
  }

  const create: Prisma.PersonCreateInput = {
    ...pick(data, ['id', 'biography', 'name', 'popularity']),
    birthday: new Date(data.birthday),
    deathday: data.deathday ? new Date(data.deathday) : undefined,
    gender: Number(data.gender),
    imdbId: data.imdb_id,
    knownForDepartment: data.known_for_department || '',
    placeOfBirth: data.place_of_birth,
    profilePath: data.profile_path,
  };
  return create;
};
