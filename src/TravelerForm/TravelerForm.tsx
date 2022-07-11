import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { useTravelerFormReducer } from './useTravelerFormReducer';
import { FormValues } from '../api/types';
import { validateOnClient } from './helpers/validateOnClient';
import { GenderRadio } from './components/GenderRadio';
import { CountryPurposeSelect } from './components/CountryPurposeSelect';

interface Props {
  initialValues: FormValues;
  onFormSubmit: (values: FormValues) => Promise<any>;
}

export const TravelerForm = ({ initialValues, onFormSubmit }: Props) => {
  const [formState, dispatch] = useTravelerFormReducer(initialValues);

  const formValues: FormValues = {
    name: formState.name.data,
    age: formState.age.data,
    gender: formState.gender.data,
    countries: formState.countries?.map((i) => ({
      id: i.id.data as number,
      name: i.name.data,
      purpose: i.purpose.data,
      start: i.start.data,
      end: i.end.data,
    })),
  };

  const formErrors = {
    name: formState.name.error,
    age: formState.age.error,
    gender: formState.gender.error,
    countries: formState.countries?.map((i) => ({
      id: i.id.error,
      name: i.name.error,
      purpose: i.purpose.error,
      start: i.start.error,
      end: i.end.error,
    })),
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const errors = validateOnClient(formValues);

    if (errors) {
      dispatch({ type: 'setErrors', errors });
      return;
    }

    dispatch({ type: 'clearAllErrors' });

    onFormSubmit(formValues)
      .then(() => {
        alert(JSON.stringify(formValues));
      })
      .catch((serverErrors) => {
        dispatch({ type: 'setErrors', errors: serverErrors });
      });
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            id="name"
            name="name"
            label="First Name"
            value={formValues.name}
            onChange={({ target }) =>
              dispatch({
                type: 'changeFieldValue',
                name: target.name as any,
                value: target.value,
              })
            }
            helperText={formErrors.name}
            error={Boolean(formErrors.name)}
            fullWidth
            autoFocus
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            id="age"
            name="age"
            label="Age"
            type="number"
            value={formValues.age}
            helperText={formErrors.age}
            error={Boolean(formErrors.age)}
            onChange={({ target }) =>
              dispatch({
                type: 'changeFieldValue',
                name: target.name as any,
                value: Number(target.value),
              })
            }
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <GenderRadio
            value={formValues.gender}
            error={formErrors.gender}
            onChange={(value) =>
              dispatch({
                type: 'changeFieldValue',
                name: 'gender',
                value,
              })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Typography component="h1" variant="h6" sx={{ mb: 1 }}>
            List of countries
          </Typography>

          <LocalizationProvider dateAdapter={AdapterMoment}>
            {formValues.countries?.map((country, index) => (
              <Grid key={country.id} container spacing={1} sx={{ mb: 3 }}>
                <Grid item xs={2.5}>
                  <TextField
                    name="name"
                    label="Country name"
                    value={country.name}
                    helperText={formErrors.countries?.[index].name}
                    error={Boolean(formErrors.countries?.[index].name)}
                    onChange={({ target }) =>
                      dispatch({
                        type: 'changeCountryField',
                        index,
                        name: 'name',
                        value: target.value,
                      })
                    }
                    fullWidth
                    autoFocus
                  />
                </Grid>

                <Grid item xs={2}>
                  <CountryPurposeSelect
                    value={country.purpose}
                    error={formErrors.countries?.[index].purpose}
                    onChange={(value) =>
                      dispatch({
                        type: 'changeCountryField',
                        index,
                        name: 'purpose',
                        value,
                      })
                    }
                  />
                </Grid>

                <Grid item xs={3}>
                  <DatePicker
                    label="Start visit"
                    value={country.start}
                    onChange={(value: any) =>
                      dispatch({
                        type: 'changeCountryField',
                        index,
                        name: 'start',
                        value: value.toISOString(),
                      })
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>

                <Grid item xs={3}>
                  <DatePicker
                    label="End visit"
                    value={country.end}
                    onChange={(value: any) =>
                      dispatch({
                        type: 'changeCountryField',
                        index,
                        name: 'end',
                        value: value.toISOString(),
                      })
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>

                <Grid item xs={1.5}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="error"
                    sx={{ mt: 1 }}
                    onClick={() => dispatch({ type: 'removeCountry', index })}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}
          </LocalizationProvider>
        </Grid>

        <Grid item xs={2}>
          <Button
            type="button"
            fullWidth
            variant="contained"
            onClick={() => dispatch({ type: 'addCountry' })}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Box>
  );
};
