import { useReducer } from 'react';
import produce from 'immer';

import { Country, FormValues } from '../api/types';
import { createNewCountry } from './helpers/createNewCountry';

type Field<Data> = { data: Data | undefined; error?: string };

interface CountryState {
  id: { data: number; error?: string };
  name: Field<string>;
  purpose: Field<string>;
  start: Field<string>;
  end: Field<string>;
}

interface FormState {
  name: Field<string>;
  age: Field<number>;
  gender: Field<string>;
  countries: CountryState[];
}

type ChangeFieldAction = {
  type: 'changeFieldValue';
  name: Exclude<keyof FormState, 'countries'>;
  value: any;
};

type ChangeCountryFieldAction = {
  type: 'changeCountryField';
  index: number;
  name: keyof Country;
  value: any;
};

type AddCountryAction = {
  type: 'addCountry';
};

type RemoveCountryAction = {
  type: 'removeCountry';
  index: number;
};

type SetErrorsAction = {
  type: 'setErrors';
  errors: Record<string, string | undefined>;
};

type ClearAllErrorsAction = {
  type: 'clearAllErrors';
};

type Action =
  | ChangeFieldAction
  | ChangeCountryFieldAction
  | AddCountryAction
  | RemoveCountryAction
  | SetErrorsAction
  | ClearAllErrorsAction;

const travelerFormReducer = produce((state: FormState, action: Action) => {
  switch (action.type) {
    case 'changeFieldValue': {
      const { name, value } = action;

      state[name].data = value;
      state[name].error = undefined;

      break;
    }

    case 'changeCountryField': {
      const { name, value, index: indexForChange } = action;

      const changedCountryeField = state.countries?.find((_, index) => index === indexForChange);

      if (changedCountryeField) {
        changedCountryeField[name].data = value;
        changedCountryeField[name].error = undefined;
      }

      break;
    }

    case 'addCountry': {
      const newCountry = createNewCountry();

      state.countries?.push({
        id: { data: newCountry.id, error: undefined },
        name: { data: newCountry.name, error: undefined },
        purpose: { data: newCountry.purpose, error: undefined },
        start: { data: newCountry.start, error: undefined },
        end: { data: newCountry.end, error: undefined },
      });

      break;
    }

    case 'removeCountry': {
      const { index: removedCountryIndex } = action;
      state.countries?.filter((_, index) => index !== removedCountryIndex);

      break;
    }

    case 'setErrors': {
      const { errors } = action;

      state.name.error = errors.name;
      state.age.error = errors.age;
      state.gender.error = errors.gender;
      state.countries.forEach((country, index) => {
        country.id.error = errors[`countries[${index}].id`] ?? undefined;
        country.name.error = errors[`countries[${index}].name`] ?? undefined;
        country.purpose.error = errors[`countries[${index}].purpose`] ?? undefined;
        country.start.error = errors[`countries[${index}].start`] ?? undefined;
        country.end.error = errors[`countries[${index}].end`] ?? undefined;
      });

      break;
    }

    case 'clearAllErrors': {
      state.name.error = undefined;
      state.age.error = undefined;
      state.gender.error = undefined;

      state.countries?.forEach((i) => {
        i.id.error = undefined;
        i.name.error = undefined;
        i.purpose.error = undefined;
        i.start.error = undefined;
        i.end.error = undefined;
      });

      break;
    }

    default:
      break;
  }
});

export const useTravelerFormReducer = (initialFormValues?: FormValues) => {
  const initialState: FormState = {
    name: { data: initialFormValues?.name || '', error: undefined },
    age: { data: initialFormValues?.age, error: undefined },
    gender: { data: initialFormValues?.gender || '', error: undefined },
    countries: (initialFormValues?.countries || []).map(
      (i): CountryState => ({
        id: { data: i.id, error: undefined },
        name: { data: i.name, error: undefined },
        purpose: { data: i.purpose, error: undefined },
        start: { data: i.start, error: undefined },
        end: { data: i.end, error: undefined },
      }),
    ),
  };

  return useReducer(travelerFormReducer, initialState);
};
