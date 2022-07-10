import { FormValues } from '../../api/types';

export const validateOnClient = (values: FormValues) => {
  const errors = {
    name: values?.name ? undefined : 'Required',
    age: Number(values?.age) > 30 ? undefined : 'Should be more than 30',
    countries: Number(values?.countries?.length) > 0 ? undefined : 'Required',
  };

  const hasErrors = (Object.keys(errors) as Array<keyof typeof errors>).some((key) =>
    Boolean(errors[key]),
  );

  return hasErrors ? errors : undefined;
};
