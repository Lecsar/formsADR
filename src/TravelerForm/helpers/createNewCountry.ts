import { Country } from '../../api/types';

export const createNewCountry = (): Country => ({
  id: Math.random(),
  purpose: '',
  name: '',
  start: new Date().toISOString(),
  end: new Date().toISOString(),
});
