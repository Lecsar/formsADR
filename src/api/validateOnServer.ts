import { FormValues } from './types';

export const validateOnServer = (values: FormValues) => {
  const countriesErrors = values.countries?.reduce((acc, country, index) => {
    if (country.name?.[0]?.toLowerCase() === 'r') {
      acc[`countries[${index}].name`] = 'First letter should not be R';
    }

    return acc;
  }, {} as Record<string, string | undefined>);

  const errors = {
    ...countriesErrors,
    name: values?.name?.[0].toLowerCase() === 'k' ? undefined : 'First letter should be K',
  };

  console.log(errors);

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
