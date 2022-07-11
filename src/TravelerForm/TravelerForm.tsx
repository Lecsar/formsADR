import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

import { FormValues } from '../api/types';
import { createNewCountry } from './helpers/createNewCountry';

interface Props {
  initialValues: FormValues;
  onFormSubmit: (values: FormValues) => Promise<any>;
}

export const TravelerForm = ({ initialValues, onFormSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({ defaultValues: initialValues });

  const { fields, append, remove } = useFieldArray({
    name: 'countries',
    control,
  });

  const handleValid = (formValues: FormValues) => {
    onFormSubmit(formValues)
      .then(() => {
        alert(JSON.stringify(formValues));
      })
      .catch((errors) => {
        Object.keys(errors).forEach((fieldName) => {
          setError(fieldName as any, { message: errors[fieldName] });
        });
      });
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(handleValid)} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="First Name"
            fullWidth
            autoFocus
            helperText={errors.name?.message}
            error={Boolean(errors.name)}
            {...register('name', { required: 'Required' })}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Age"
            type="number"
            helperText={errors.age?.message}
            error={Boolean(errors.age)}
            fullWidth
            {...register('age', { min: { value: 30, message: 'Should be more than 30' } })}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl>
            <FormLabel error={Boolean(errors.gender)}>Gender</FormLabel>

            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <RadioGroup ref={ref} value={value} onChange={onChange} onBlur={onBlur}>
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography component="h1" variant="h6" sx={{ mb: 1 }}>
            List of countries
          </Typography>

          <LocalizationProvider dateAdapter={AdapterMoment}>
            {fields.map((country, index) => (
              <Grid key={country.id} container spacing={1} sx={{ mb: 3 }}>
                <Grid item xs={2.5}>
                  <TextField
                    label="Country name"
                    fullWidth
                    autoFocus
                    helperText={errors.countries?.[index]?.name?.message}
                    error={Boolean(errors.countries?.[index]?.name?.message)}
                    {...register(`countries.${index}.name`, { required: 'Required' })}
                  />
                </Grid>

                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Purpose</InputLabel>

                    <Controller
                      control={control}
                      name={`countries.${index}.purpose`}
                      rules={{ required: 'Required' }}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Select
                          ref={ref}
                          label="Purpose"
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          error={Boolean(errors.countries?.[index]?.purpose?.message)}
                        >
                          <MenuItem value="Work">Work</MenuItem>
                          <MenuItem value="Tourism">Tourism</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={3}>
                  <Controller
                    control={control}
                    name={`countries.${index}.start`}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <DatePicker
                        ref={ref}
                        label="Start visit"
                        value={value}
                        // @ts-expect-error
                        onBlur={onBlur as any}
                        onChange={(value: any) => onChange(value.toISOString())}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={3}>
                  <Controller
                    control={control}
                    name={`countries.${index}.end`}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <DatePicker
                        ref={ref}
                        label="End visit"
                        value={value}
                        // @ts-expect-error
                        onBlur={onBlur as any}
                        onChange={(value: any) => onChange(value.toISOString())}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={1.5}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="error"
                    sx={{ mt: 1 }}
                    onClick={() => remove(index)}
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
            onClick={() => append(createNewCountry())}
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
