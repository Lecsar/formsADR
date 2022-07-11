import { useReducer } from 'react';

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
  name: keyof FormState;
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

const travelerFormReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case 'changeFieldValue': {
      const { name, value } = action;
      const newState: FormState = { ...state, [name]: { data: value, error: undefined } };

      return newState;
    }

    case 'changeCountryField': {
      const { name, value, index: indexForChange } = action;
      const newCountriesState: CountryState[] = state.countries.map((i, index) =>
        index === indexForChange ? { ...(i as any), [name]: { data: value, error: undefined } } : i,
      );

      const newState: FormState = { ...state, countries: newCountriesState };
      return newState;
    }

    case 'addCountry':
      const newCountry = createNewCountry();
      const newState: FormState = {
        ...state,
        countries: [
          ...state.countries,
          {
            id: { data: newCountry.id as number, error: undefined },
            name: { data: newCountry.name, error: undefined },
            purpose: { data: newCountry.purpose, error: undefined },
            start: { data: newCountry.start, error: undefined },
            end: { data: newCountry.end, error: undefined },
          },
        ],
      };

      return newState;

    case 'removeCountry': {
      const { index: removedCountryIndex } = action;
      const newState: FormState = {
        ...state,
        countries: (state.countries || []).filter((_, index) => index !== removedCountryIndex),
      };

      return newState;
    }

    case 'setErrors': {
      const { errors } = action;
      const newState: FormState = {
        name: { data: state.name.data, error: errors.name },
        age: { data: state.age.data, error: errors.age },
        gender: { data: state.gender.data, error: errors.gender },
        countries: state.countries.map((i, index) => ({
          id: {
            data: i.id.data as number,
            error: errors[`countries[${index}].id`] ?? undefined,
          },
          name: { data: i.name.data, error: errors[`countries[${index}].name`] ?? undefined },
          purpose: {
            data: i.purpose.data,
            error: errors[`countries[${index}].purpose`] ?? undefined,
          },
          start: { data: i.start.data, error: errors[`countries[${index}].start`] ?? undefined },
          end: { data: i.end.data, error: errors[`countries[${index}].end`] ?? undefined },
        })),
      };

      return newState;
    }

    case 'clearAllErrors': {
      const newState: FormState = {
        name: { data: state.name.data, error: undefined },
        age: { data: state.age.data, error: undefined },
        gender: { data: state.gender.data, error: undefined },
        countries: state.countries?.map((i) => ({
          id: { data: i.id.data as number, error: undefined },
          name: { data: i.name.data, error: undefined },
          start: { data: i.start.data, error: undefined },
          end: { data: i.end.data, error: undefined },
          purpose: { data: i.purpose.data, error: undefined },
        })),
      };

      return newState;
    }

    default:
      return state;
  }
};

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
