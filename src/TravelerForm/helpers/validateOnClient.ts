import { FormValues } from '../../api/types';

export const validateOnClient = (
  values: FormValues,
): Record<string, string | undefined> | undefined => {
  const countriesErrors = values.countries?.reduce((acc, country, index) => {
    if (!country.name) {
      acc[`countries[${index}].name`] = 'Required';
    }

    if (!country.purpose) {
      acc[`countries[${index}].purpose`] = 'Required';
    }

    return acc;
  }, {} as Record<string, string | undefined>);

  const errors = {
    ...countriesErrors,
    name: values?.name ? undefined : 'Required',
    age: Number(values?.age) > 30 ? undefined : 'Should be more than 30',
  };

  const hasErrors = (Object.keys(errors) as Array<keyof typeof errors>).some((key) =>
    Boolean(errors[key]),
  );

  return hasErrors ? errors : undefined;
};
