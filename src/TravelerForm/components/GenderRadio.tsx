import React from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface Props {
  value?: string;
  error?: string;
  onChange: (value: string) => void;
}

export const GenderRadio = ({ value, onChange, error }: Props) => (
  <FormControl>
    <FormLabel error={Boolean(error)}>Gender</FormLabel>
    <RadioGroup name="gender" value={value} onChange={({ target }) => onChange(target.value)}>
      <FormControlLabel value="female" control={<Radio />} label="Female" />
      <FormControlLabel value="male" control={<Radio />} label="Male" />
    </RadioGroup>
  </FormControl>
);
