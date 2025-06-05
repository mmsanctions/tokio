'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Grid,
} from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { OCCUPATION_CODES } from './occupation';
import { OCCPSECS } from './occpsecs';
import { NATIONALITIES } from './nationality';
import { MARITAL_STATUSES } from './marital';
import { NATURE_BUSINESSES } from './nat-business';


const steps = ['Personal Details', 'Occupation & Contact', 'Address & Other Info'];

interface FormData {
  SNAME: string;
  SALUTATION: string;
  PASSPORT: string;
  NATIONALITY: string;
  GENDER: string;
  DOB: string;
  OCCUPATION_CODE: string;
  ADDRESS_1: string;
  ADDRESS_2: string;
  ADDRESS_3: string;
  POSTCODE: string;
  MOBILE_NO: string;
  MARITAL_STATUS: string;
  EMAIL: string;
  NATURE_BUSINESS: string;
  OCCPSEC: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function SpecialGeneralWorkerPA() {
  const [activeStep, setActiveStep] = useState(0);
  const [dob, setDob] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormData>({
    SNAME: '',
    SALUTATION: '',
    PASSPORT: '',
    NATIONALITY: 'IND',
    GENDER: '',
    DOB: '',
    OCCUPATION_CODE: '0605',
    ADDRESS_1: '',
    ADDRESS_2: '',
    ADDRESS_3: '',
    POSTCODE: '',
    MOBILE_NO: '',
    MARITAL_STATUS: '',
    EMAIL: '',
    NATURE_BUSINESS: 'FE',
    OCCPSEC: 'FW20',
  });

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    
    switch (step) {
      case 0: // Personal Details
        if (!form.SALUTATION) newErrors.SALUTATION = 'Salutation is required';
        if (!form.SNAME.trim()) newErrors.SNAME = 'Name is required';
        if (!form.PASSPORT.trim()) newErrors.PASSPORT = 'Passport number is required';
        if (!form.NATIONALITY) newErrors.NATIONALITY = 'Nationality is required';
        if (!form.GENDER) newErrors.GENDER = 'Gender is required';
        if (!form.DOB) newErrors.DOB = 'Date of birth is required';
        break;
      case 1: // Occupation & Contact
        if (!form.OCCUPATION_CODE) newErrors.OCCUPATION_CODE = 'Occupation is required';
        if (!form.EMAIL.trim()) newErrors.EMAIL = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.EMAIL)) newErrors.EMAIL = 'Email is invalid';
        if (!form.MOBILE_NO.trim()) newErrors.MOBILE_NO = 'Mobile number is required';
        if (!form.POSTCODE.trim()) newErrors.POSTCODE = 'Postcode is required';
        break;
      case 2: // Address & Other Info
        if (!form.ADDRESS_1.trim()) newErrors.ADDRESS_1 = 'Address line 1 is required';
        if (!form.MARITAL_STATUS) newErrors.MARITAL_STATUS = 'Marital status is required';
        if (!form.NATURE_BUSINESS) newErrors.NATURE_BUSINESS = 'Nature of business is required';
        if (!form.OCCPSEC) newErrors.OCCPSEC = 'Occupation sector is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setDob(date);
    setForm((prev) => ({
      ...prev,
      DOB: date ? date.toISOString().split('T')[0] : '',
    }));
    
    if (errors.DOB) {
      setErrors((prev) => ({
        ...prev,
        DOB: '',
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('/api/submit-pa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setTimeout(() => {
          setForm({
            SNAME: '', SALUTATION: '', PASSPORT: '', NATIONALITY: '', GENDER: '',
            DOB: '', OCCUPATION_CODE: '', ADDRESS_1: '', ADDRESS_2: '', ADDRESS_3: '',
            POSTCODE: '', MOBILE_NO: '', MARITAL_STATUS: '', EMAIL: '',
            NATURE_BUSINESS: '', OCCPSEC: '',
          });
          setDob(null);
          setActiveStep(0);
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.SALUTATION}>
                <InputLabel id="SALUTATION-label">Salutation</InputLabel>
                <Select
                  labelId="SALUTATION-label"
                  id="SALUTATION"
                  name="SALUTATION"
                  value={form.SALUTATION}
                  label="Salutation"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="MR">MR</MenuItem>
                  <MenuItem value="MRS">MRS</MenuItem>
                  <MenuItem value="MS">MS</MenuItem>
                </Select>
                {errors.SALUTATION && <FormHelperText>{errors.SALUTATION}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                fullWidth
                id="SNAME"
                name="SNAME"
                label="Name of Insured Person *"
                value={form.SNAME}
                onChange={handleChange}
                error={!!errors.SNAME}
                helperText={errors.SNAME}
                autoComplete="name"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="PASSPORT"
                name="PASSPORT"
                label="Passport Number *"
                value={form.PASSPORT}
                onChange={handleChange}
                error={!!errors.PASSPORT}
                helperText={errors.PASSPORT}
                autoComplete="off"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.NATIONALITY}>
                <InputLabel id="NATIONALITY-label">Nationality *</InputLabel>
                <Select
                  labelId="NATIONALITY-label"
                  id="NATIONALITY"
                  name="NATIONALITY"
                  value={form.NATIONALITY}
                  label="Nationality *"
                  onChange={handleChange}
                >
                  {NATIONALITIES.map((n) => (
                    <MenuItem key={n.value} value={n.value}>{n.label}</MenuItem>
                  ))}
                </Select>
                {errors.NATIONALITY && <FormHelperText>{errors.NATIONALITY}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl error={!!errors.GENDER}>
                <FormLabel id="GENDER-label" sx={{ mb: 1 }}>Gender *</FormLabel>
                <RadioGroup
                  row
                  id="GENDER"
                  name="GENDER"
                  value={form.GENDER}
                  onChange={handleChange}
                >
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                </RadioGroup>
                {errors.GENDER && <FormHelperText>{errors.GENDER}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth *"
                  value={dob}
                  onChange={handleDateChange}
                  format="dd-MM-yyyy" // <-- Add this line for Malaysian format
                  slotProps={{ 
                    textField: { 
                      fullWidth: true, 
                      id: 'DOB', 
                      name: 'DOB',
                      error: !!errors.DOB,
                      helperText: errors.DOB
                    } 
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth error={!!errors.OCCUPATION_CODE}>
                <InputLabel id="OCCUPATION_CODE-label">Occupation *</InputLabel>
                <Select
                  labelId="OCCUPATION_CODE-label"
                  id="OCCUPATION_CODE"
                  name="OCCUPATION_CODE"
                  value={form.OCCUPATION_CODE}
                  label="Occupation *"
                  onChange={handleChange}
                >
                  {OCCUPATION_CODES.map((o) => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
                {errors.OCCUPATION_CODE && <FormHelperText>{errors.OCCUPATION_CODE}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="EMAIL"
                name="EMAIL"
                label="Email *"
                type="email"
                value={form.EMAIL}
                onChange={handleChange}
                error={!!errors.EMAIL}
                helperText={errors.EMAIL}
                autoComplete="email"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="MOBILE_NO"
                name="MOBILE_NO"
                label="Mobile Number *"
                value={form.MOBILE_NO}
                onChange={handleChange}
                error={!!errors.MOBILE_NO}
                helperText={errors.MOBILE_NO}
                autoComplete="tel"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="POSTCODE"
                name="POSTCODE"
                label="Postcode *"
                value={form.POSTCODE}
                onChange={handleChange}
                error={!!errors.POSTCODE}
                helperText={errors.POSTCODE}
                autoComplete="postal-code"
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Address</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="ADDRESS_1"
                name="ADDRESS_1"
                label="Address Line 1 *"
                value={form.ADDRESS_1}
                onChange={handleChange}
                error={!!errors.ADDRESS_1}
                helperText={errors.ADDRESS_1}
                autoComplete="address-line1"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="ADDRESS_2"
                name="ADDRESS_2"
                label="Address Line 2"
                value={form.ADDRESS_2}
                onChange={handleChange}
                autoComplete="address-line2"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="ADDRESS_3"
                name="ADDRESS_3"
                label="Address Line 3"
                value={form.ADDRESS_3}
                onChange={handleChange}
                autoComplete="address-line3"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Additional Information</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.MARITAL_STATUS}>
                <InputLabel id="MARITAL_STATUS-label">Marital Status *</InputLabel>
                <Select
                  labelId="MARITAL_STATUS-label"
                  id="MARITAL_STATUS"
                  name="MARITAL_STATUS"
                  value={form.MARITAL_STATUS}
                  label="Marital Status *"
                  onChange={handleChange}
                >
                  {MARITAL_STATUSES.map((m) => (
                    <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                  ))}
                </Select>
                {errors.MARITAL_STATUS && <FormHelperText>{errors.MARITAL_STATUS}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.NATURE_BUSINESS}>
                <InputLabel id="NATURE_BUSINESS-label">Nature of Business *</InputLabel>
                <Select
                  labelId="NATURE_BUSINESS-label"
                  id="NATURE_BUSINESS"
                  name="NATURE_BUSINESS"
                  value={form.NATURE_BUSINESS}
                  label="Nature of Business *"
                  onChange={handleChange}
                >
                  {NATURE_BUSINESSES.map((n) => (
                    <MenuItem key={n.value} value={n.value}>{n.label}</MenuItem>
                  ))}
                </Select>
                {errors.NATURE_BUSINESS && <FormHelperText>{errors.NATURE_BUSINESS}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth error={!!errors.OCCPSEC}>
                <InputLabel id="OCCPSEC-label">Occupation Sector *</InputLabel>
                <Select
                  labelId="OCCPSEC-label"
                  id="OCCPSEC"
                  name="OCCPSEC"
                  value={form.OCCPSEC}
                  label="Occupation Sector *"
                  onChange={handleChange}
                >
                  {OCCPSECS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
                {errors.OCCPSEC && <FormHelperText>{errors.OCCPSEC}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Card elevation={8} sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', 
          color: 'white', 
          p: { xs: 3, sm: 4 }, 
          textAlign: 'center' 
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Special General Worker PA
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Tokio Marine Insurance
          </Typography>
        </Box>
        
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          {submitStatus === 'success' && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Form submitted successfully! The page will reset shortly.
            </Alert>
          )}
          
          {submitStatus === 'error' && (
            <Alert severity="error" sx={{ mb: 3 }}>
              There was an error submitting the form. Please try again.
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {renderStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="large"
                  sx={{ 
                    minWidth: 120,
                    py: 1.5,
                    fontWeight: 600,
                    position: 'relative'
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Submit'
                  )}
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={handleNext}
                  size="large"
                  sx={{ py: 1.5, fontWeight: 600 }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}