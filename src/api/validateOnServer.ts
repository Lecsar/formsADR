import { FormValues } from './types';

export const validateOnServer = (values: FormValues) => {
  const errors = {
    name: values?.name?.[0].toLowerCase() === 'k' ? undefined : 'First letter should be K',
    countries: Number(values?.countries?.length) > 2 ? undefined : 'Should be more than 2',
    'countries[0]':
      values?.countries?.[0].name === 'Russia' && values?.countries?.[0].purpose === 'Work'
        ? 'Bad country for work'
        : undefined,
    'countries[0].name':
      values?.countries?.[0].name?.[0]?.toLowerCase() === 'l'
        ? undefined
        : 'First letter should be l',
  };

  const hasErrors = (Object.keys(errors) as Array<keyof typeof errors>).some((key) =>
    Boolean(errors[key]),
  );

  return new Promise((res, reject) => {
    setTimeout(() => {
      if (hasErrors) {
        reject(errors);
      } else {
        res(true);
      }
    }, 1500);
  });
};
