import { FormValues } from './types';

export const apiGetInitialValues = (): Promise<FormValues> =>
  new Promise((res) => {
    setTimeout(() => {
      res({
        name: 'Dmitry',
        age: 24,
        gender: 'male',
        countries: [
          {
            id: 1,
            name: 'Russia',
            purpose: 'Work',
            start: '2022-06-23T00:00:00.000Z',
            end: '2022-06-29T00:00:00.000Z',
          },
        ],
      });
    }, 0);
  });
