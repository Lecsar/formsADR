import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

interface Props {
  text: string;
}

export const ErrorText = ({ text }: Props) => (
  <Grid item xs={12}>
    <Typography color="red">{text}</Typography>
  </Grid>
);
