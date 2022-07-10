import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

interface Props {
  value?: string;
  error?: string;
  onChange: (value: string) => void;
}

export const CountryPurposeSelect = ({ value, error, onChange }: Props) => (
  <FormControl fullWidth>
    <InputLabel>Purpose</InputLabel>
    <Select
      label="Purpose"
      value={value}
      error={Boolean(error)}
      onChange={({ target }) => onChange(target.value)}
    >
      <MenuItem value="Work">Work</MenuItem>
      <MenuItem value="Tourism">Tourism</MenuItem>
      <MenuItem value="Other">Other</MenuItem>
    </Select>
  </FormControl>
);
