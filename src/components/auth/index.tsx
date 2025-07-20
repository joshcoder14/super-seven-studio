'use client';
import React, { useState } from 'react';
import HeadingComponent from "./Heading";
import { LoginContainer, LoginWrapper, Login, FormWrapper, ActionButton } from "./styles";
import type { FormSection } from '@/types/field';
import CheckboxComponent from '@/components/checkbox';
import { Box, Typography, IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { AuthResponse } from '@/types/user';
import { loginUser, registerUser } from '@/lib/api/fetchAuth';
import {
  PasswordRequirements,
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone,
  validateName,
  validateEmail,
  validatePassword,
  validatePhone,
  validateConfirmPassword
} from '@/utils/validation';
import Swal from 'sweetalert2';

interface AuthComponentProps {
  variant?: 'login' | 'signup';
}

interface FieldErrors {
  [key: string]: string | null;
}

export default function AuthComponent({ variant = 'login' }: AuthComponentProps): React.JSX.Element {
  const isLogin = variant === 'login';
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm_password: false,
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState<boolean>(false);
  const { login } = useAuth();
  const router = useRouter();

  const headingData = {
    title: isLogin ? 'Login to Account' : 'Create Account',
    subText: isLogin
      ? 'Please enter your email and password to continue'
      : 'Please create your account to continue',
  };

  const formFields: FormSection[] = isLogin
    ? [
      {
        id: "email",
        columnCount: 1,
        fields: [{
          id: "email",
          name: "email",
          label: 'Email Address',
          type: "email",
          required: true,
        }],
      },
      {
        id: "password",
        columnCount: 1,
        fields: [{
          id: "password",
          name: "password",
          label: 'Password',
          type: "password",
          required: true,
        }],
      }
    ]
    : [
      {
        id: "first_name",
        columnCount: 1,
        fields: [{
          id: "first_name",
          name: "first_name",
          label: 'First Name',
          type: "text",
          required: true,
        }],
      },
      {
        id: "last_name",
        columnCount: 1,
        fields: [{
          id: "last_name",
          name: "last_name",
          label: 'Last Name',
          type: "text",
          required: true,
        }],
      },
      {
        id: "email",
        columnCount: 1,
        fields: [{
          id: "email",
          name: "email",
          label: 'Email Address',
          type: "email",
          required: true,
        }],
      },
      {
        id: "password",
        columnCount: 1,
        fields: [{
          id: "password",
          name: "password",
          label: 'Password',
          type: "password",
          required: true,
        }],
      },
      {
        id: "confirm_password",
        columnCount: 1,
        fields: [{
          id: "confirm_password",
          name: "confirm_password",
          label: 'Confirm Password',
          type: "password",
          required: true,
        }],
      },
      {
        id: "contact_no",
        columnCount: 1,
        fields: [{
          id: "contact_no",
          name: "contact_no",
          label: 'Phone Number',
          type: "text",
          required: true,
        }],
      }
    ];

  const togglePasswordVisibility = (field: string) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const scrollToFirstError = () => {
    const firstErrorField = Object.keys(fieldErrors)[0];
    if (firstErrorField) {
      const element = document.getElementById(firstErrorField);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element?.focus();
    }
  };

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        return validateEmail(value) ? 'Please enter a valid email' : null;
      case 'password':
        if (!value) return 'Password is required';
        if (!isLogin) {
          const requirements = validatePassword(value);
          setPasswordRequirements(requirements);
          if (!Object.values(requirements).every(v => v)) {
            return 'Password does not meet requirements';
          }
        }
        return null;
      case 'first_name':
      case 'last_name':
        if (!value) return `${name.split('_').join(' ')} is required`;
        return validateName(name.split('_').join(' '), value) ? 'Please enter a valid name' : null;
      case 'confirm_password':
        if (!value) return 'Please confirm your password';
        if (formData.password !== value) return 'Passwords do not match';
        return null;
      case 'contact_no':
        if (!value) return 'Phone number is required';
        return validatePhone(value) ? 'Please enter a valid phone number' : null;
      default:
        return null;
    }
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    let isValid = true;

    formFields.forEach(section => {
      section.fields.forEach(field => {
        if (field.required) {
          const error = validateField(field.name, formData[field.name] || '');
          if (error) {
            errors[field.name] = error;
            isValid = false;
          }
        }
      });
    });

    setFieldErrors(errors);
    if (!isValid) scrollToFirstError();
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    switch (name) {
      case 'email':
        sanitizedValue = sanitizeEmail(value);
        break;
      case 'contact_no':
        sanitizedValue = sanitizePhone(value);
        break;
      default:
        sanitizedValue = sanitizeInput(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Validate the field as user types
    const error = validateField(name, sanitizedValue);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Special case for password field
    if (name === 'password') {
      const requirements = validatePassword(sanitizedValue);
      setPasswordRequirements(requirements);
      
      // Show requirements if password has value and not all requirements are met
      setShowPasswordRequirements(!!sanitizedValue && !Object.values(requirements).every(v => v));
      
      // Validate confirm password if it exists
      if (formData.confirm_password) {
        const confirmPwError = validateField('confirm_password', formData.confirm_password);
        setFieldErrors(prev => ({
          ...prev,
          confirm_password: confirmPwError
        }));
      }
    }

    // Special case for confirm password - validate against password
    if (name === 'confirm_password' && formData.password) {
      const confirmPwError = validateField('confirm_password', sanitizedValue);
      setFieldErrors(prev => ({
        ...prev,
        confirm_password: confirmPwError
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      localStorage.removeItem('access_token');

      if (isLogin) {
        const data = await loginUser({
          email: formData.email,
          password: formData.password,
          remember: rememberMe
        });

        if (!data.access_token || !data.data) {
          throw new Error('Authentication failed: Invalid response');
        }

        if (rememberMe) {
          localStorage.setItem('access_token', data.access_token);
        } else {
          sessionStorage.setItem('access_token', data.access_token);
        }

        const user = await login({
          ...data,
          remember: rememberMe
        });

        if (user) {
          window.location.href = paths.workload;
          window.location.reload();
        }
      } else {
        Swal.fire({
          title: 'Processing...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await registerUser({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password,
          contact_no: formData.contact_no,
          customer_type: 1
        });

        await Swal.fire({
          title: 'Success!',
          text: 'You have successfully registered!',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
        });

        setError(null);
        router.push(paths.login);
      }
    } catch (err) {
      let errorMessage = 'Registration failed';
      const backendErrors: FieldErrors = {};

      if (err instanceof Error) {
        try {
          const errorResponse = JSON.parse(err.message);
          
          if (errorResponse.errors) {
            Object.keys(errorResponse.errors).forEach(field => {
              backendErrors[field] = errorResponse.errors[field][0];
            });
            
            setFieldErrors(backendErrors);
            scrollToFirstError();
            return;
          }
          
          if (errorResponse.message) {
            errorMessage = errorResponse.message;
          }
        } catch (e) {
          errorMessage = err.message;
        }
      }

      await Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Login>
      <LoginContainer>
        <Box className="logo">
          <img
            src="/assets/site-logo.svg"
            alt="Logo"
            style={{ width: "60%", height: "auto" }}
          />
        </Box>
        <LoginWrapper>
          <HeadingComponent
            title={headingData.title}
            subText={headingData.subText}
          />

          <form onSubmit={handleSubmit}>
            {formFields.map((section) => (
              <FormWrapper key={section.id} className='form-wrapper'>
                {section.fields.map((field) => (
                  <Box className="form-group" key={field.id} sx={{ mb: 3 }}>
                    <Box className="label">
                      <label htmlFor={field.id}>{field.label}</label>
                      {section.forgotButton && (
                        <Link href={section.forgotButton.linkUrl}>
                          {section.forgotButton.linkLabel}
                        </Link>
                      )}
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                      {field.type === 'password' ? (
                        <Box className="password-input" sx={{ position: 'relative' }}>
                          <input
                            type={showPassword[field.name as keyof typeof showPassword] ? 'text' : 'password'}
                            name={field.name}
                            id={field.id}
                            required={field.required}
                            onChange={handleInputChange}
                            value={formData[field.name] || ''}
                            style={{
                              width: '100%',
                              paddingRight: '40px',
                              borderColor: fieldErrors[field.name] ? '#ff0000' : undefined,
                              borderWidth: fieldErrors[field.name] ? '0.3px' : undefined,
                              backgroundColor: fieldErrors[field.name] ? '#fff0f0' : undefined,
                              fontWeight: fieldErrors[field.name] ? '500' : undefined
                            }}
                          />
                          <IconButton
                            size="small"
                            className='toggle-password'
                            onClick={() => togglePasswordVisibility(field.name)}
                            sx={{
                              position: 'absolute',
                              right: 8,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: 'action.active',
                            }}
                          >
                            {showPassword[field.name as keyof typeof showPassword] ? (
                              <VisibilityIcon fontSize="small" />
                            ) : (
                              <VisibilityOffIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          id={field.id}
                          required={field.required}
                          onChange={handleInputChange}
                          value={formData[field.name] || ''}
                          maxLength={field.name === 'contact_no' ? 11 : undefined}
                          style={{
                            borderColor: fieldErrors[field.name] ? '#ff0000' : undefined,
                            borderWidth: fieldErrors[field.name] ? '2px' : undefined,
                            backgroundColor: fieldErrors[field.name] ? '#fff0f0' : undefined
                          }}
                        />
                      )}
                    </Box>

                    {fieldErrors[field.name] && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          color: '#ff0000',
                          fontSize: '0.75rem',
                          mt: 0.5,
                          ml: 1,
                          fontWeight: 'bold'
                        }}
                      >
                        ⚠️ {fieldErrors[field.name]}
                      </Typography>
                    )}

                    {!isLogin && field.name === 'password' && showPasswordRequirements && (
                      <Box mt={1} ml={1}>
                        <Typography variant="caption" component="div"
                          sx={{ 
                            color: passwordRequirements.hasMinLength ? 'green' : 'inherit',
                            fontWeight: passwordRequirements.hasMinLength ? 'bold' : 'normal'
                          }}>
                          {passwordRequirements.hasMinLength ? '✓' : '•'} At least 8 characters
                        </Typography>
                        <Typography variant="caption" component="div"
                          sx={{ 
                            color: passwordRequirements.hasUpperCase ? 'green' : 'inherit',
                            fontWeight: passwordRequirements.hasUpperCase ? 'bold' : 'normal'
                          }}>
                          {passwordRequirements.hasUpperCase ? '✓' : '•'} At least 1 uppercase letter
                        </Typography>
                        <Typography variant="caption" component="div"
                          sx={{ 
                            color: passwordRequirements.hasLowerCase ? 'green' : 'inherit',
                            fontWeight: passwordRequirements.hasLowerCase ? 'bold' : 'normal'
                          }}>
                          {passwordRequirements.hasLowerCase ? '✓' : '•'} At least 1 lowercase letter
                        </Typography>
                        <Typography variant="caption" component="div"
                          sx={{ 
                            color: passwordRequirements.hasNumber ? 'green' : 'inherit',
                            fontWeight: passwordRequirements.hasNumber ? 'bold' : 'normal'
                          }}>
                          {passwordRequirements.hasNumber ? '✓' : '•'} At least 1 number
                        </Typography>
                      </Box>
                    )}

                    {!isLogin && field.name === 'confirm_password' && formData.confirm_password && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: formData.password === formData.confirm_password ? 'green' : 'red',
                          fontSize: '0.75rem',
                          mt: 0.5,
                          fontWeight: 'bold'
                        }}
                      >
                        {formData.password === formData.confirm_password
                          ? '✓ Passwords match'
                          : '✗ Passwords do not match'}
                      </Typography>
                    )}
                  </Box>
                ))}
              </FormWrapper>
            ))}

            {isLogin && (
              <Box className="form-group remember">
                <CheckboxComponent
                  checked={rememberMe}
                  id='remember'
                  name='remember'
                  label='Remember me'
                  onChange={(checked) => setRememberMe(checked)}
                />
              </Box>
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {error && (
            <Box className="error-message" sx={{ color: 'error.main', mb: 2, width: '100%', textAlign: 'center' }}>
              {error}
            </Box>
          )}

          <ActionButton>
            <Typography component="p">
              {isLogin ? (
                <>Don't have an account? <Link href={paths.register}>Create Account</Link></>
              ) : (
                <>Already have an account? <Link href={paths.login}>Sign In</Link></>
              )}
            </Typography>
          </ActionButton>
        </LoginWrapper>
      </LoginContainer>
    </Login>
  );
}