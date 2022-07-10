import { useReducer } from 'react';

import { FormValues } from '../api/types';
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
  countries: Field<Field<CountryState>[]>;
}

type ChangeFieldAction = {
  type: 'changeFieldValue';
  name: keyof FormState;
  value: any;
};

type ChangeCountryFieldAction = {
  type: 'changeCountryField';
  index: number;
  name: keyof CountryState;
  value: any;
};

type AddCountryAction = {
  type: 'addCountry';
};

type RemoveCountryAction = {
  type: 'removeCountry';
  index: number;
};

type SetClientErrorsAction = {
  type: 'setClientErrors';
  errors: {
    name?: string;
    age?: string;
    gender?: string;
    countries?: string;
  };
};

type SetServerErrorsAction = {
  type: 'setServerErrors';
  errors: {
    name?: string;
    age?: string;
    gender?: string;
    countries?: string;
    'countries[0]'?: string;
    'countries[0].name'?: string;
  };
};

type ClearAllErrorsAction = {
  type: 'clearAllErrors';
};

type Action =
  | ChangeFieldAction
  | ChangeCountryFieldAction
  | AddCountryAction
  | RemoveCountryAction
  | SetClientErrorsAction
  | SetServerErrorsAction
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
      const newCountriesState: Field<Field<CountryState>[]> = {
        data: state.countries.data?.map((i, index) =>
          index === indexForChange
            ? {
                data: { ...(i.data as any), [name]: { data: value, error: undefined } },
                error: undefined,
              }
            : i,
        ),
        error: undefined,
      };

      const newState: FormState = { ...state, countries: newCountriesState };
      return newState;
    }

    case 'addCountry':
      const newCountry = createNewCountry();
      const newState: FormState = {
        ...state,
        countries: {
          data: [
            ...(state.countries.data || []),
            {
              data: {
                id: { data: newCountry.id, error: undefined },
                name: { data: newCountry.name, error: undefined },
                purpose: { data: newCountry.purpose, error: undefined },
                start: { data: newCountry.start, error: undefined },
                end: { data: newCountry.end, error: undefined },
              },
              error: undefined,
            },
          ],
          error: undefined,
        },
      };

      return newState;

    case 'removeCountry': {
      const { index: removedCountryIndex } = action;
      const newState: FormState = {
        ...state,
        countries: {
          data: (state.countries.data || []).filter((_, index) => index !== removedCountryIndex),
          error: undefined,
        },
      };

      return newState;
    }

    case 'setClientErrors': {
      const { errors } = action;
      const newState: FormState = {
        name: { data: state.name.data, error: errors.name },
        age: { data: state.age.data, error: errors.age },
        gender: { data: state.gender.data, error: errors.gender },
        countries: {
          data: state.countries.data,
          error: errors.countries,
        },
      };

      return newState;
    }

    case 'setServerErrors': {
      const { errors } = action;
      const newState: FormState = {
        name: { data: state.name.data, error: errors.name },
        age: { data: state.age.data, error: errors.age },
        gender: { data: state.gender.data, error: errors.gender },
        countries: {
          data: state.countries.data,
          error: errors.countries,
        },
      };

      console.log(errors);

      // I don't wont to parse backend errors, it's crutch
      if (errors['countries[0]'] && newState.countries.data?.[0]) {
        newState.countries.data[0].error = errors['countries[0]'];
      }

      if (errors['countries[0].name'] && newState.countries.data?.[0]?.data?.name) {
        newState.countries.data[0].data.name.error = errors['countries[0].name'];
      }
      //

      return newState;
    }

    case 'clearAllErrors': {
      const newState: FormState = {
        name: { data: state.name.data, error: undefined },
        age: { data: state.age.data, error: undefined },
        gender: { data: state.gender.data, error: undefined },
        countries: {
          data: state.countries.data?.map((i) => ({
            data: {
              id: { data: i.data?.id.data as number, error: undefined },
              name: { data: i.data?.name.data, error: undefined },
              start: { data: i.data?.start.data, error: undefined },
              end: { data: i.data?.end.data, error: undefined },
              purpose: { data: i.data?.purpose.data, error: undefined },
            },
            error: undefined,
          })),
          error: undefined,
        },
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
    countries: {
      data: initialFormValues?.countries?.map(
        (i): Field<CountryState> => ({
          data: {
            id: { data: i.id, error: undefined },
            name: { data: i.name, error: undefined },
            purpose: { data: i.purpose, error: undefined },
            start: { data: i.start, error: undefined },
            end: { data: i.end, error: undefined },
          },
          error: undefined,
        }),
      ),
      error: undefined,
    },
  };

  return useReducer(travelerFormReducer, initialState);
};
