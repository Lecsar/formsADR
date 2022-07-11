import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { TravelerForm } from './TravelerForm';
import { FormValues } from './api/types';
import { apiGetInitialValues } from './api/apiGetInitialValues';
import { validateOnServer } from './api/validateOnServer';

const theme = createTheme();

export const App = () => {
  const [initialFormValues, setInitialFormValues] = useState<FormValues>();

  useEffect(() => {
    apiGetInitialValues().then(setInitialFormValues);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Pure React Form
          </Typography>

          {initialFormValues ? (
            <TravelerForm initialValues={initialFormValues} onFormSubmit={validateOnServer} />
          ) : (
            <Typography component="h1" variant="h6">
              Loading initial values...
            </Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};
