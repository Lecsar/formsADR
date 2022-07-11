import * as yup from 'yup';

import { FormValues } from '../../api/types';

const formSchema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number().min(30, 'Should be more than 30'),
  countries: yup.array().of(
    yup.object({
      name: yup.string().required('Name is required'),
      purpose: yup.string().required('Purpose is required'),
    }),
  ),
});

const collectErrors = (error: yup.ValidationError) =>
  error.inner.reduce((acc: any, { path, message }: any) => {
    acc[path] = message;
    return acc;
  }, {} as Record<string, string>);

export const validateOnClient = (values: FormValues): Record<string, string> | undefined => {
  try {
    formSchema.validateSync(values, { abortEarly: false });
    return undefined;
  } catch (validationErrors) {
    return collectErrors(validationErrors as yup.ValidationError);
  }
};
