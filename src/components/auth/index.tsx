'use client';
import React, { useState } from 'react';
import HeadingComponent from "./Heading";
import { LoginContainer, LoginWrapper, Login, FormWrapper } from "./styles";
import type { FormSection } from '@/types/field';
import CheckboxComponent from '@/components/checkbox';
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { AuthResponse } from '@/types/user';
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

    let error = null;
    
    if (name === 'first_name' || name === 'last_name') {
      error = validateName(name === 'first_name' ? 'First name' : 'Last name', sanitizedValue);
    } else if (name === 'email') {
      error = validateEmail(sanitizedValue);
    } else if (name === 'password') {
      if (isLogin) {
        error = !sanitizedValue ? 'Password is required' : null;
      } else {
        const requirements = validatePassword(sanitizedValue);
        setPasswordRequirements(requirements);
        error = Object.values(requirements).every(v => v) ? null : 'Password does not meet requirements';
        if (formData.confirm_password) {
          setFieldErrors(prev => ({
            ...prev,
            confirm_password: validateConfirmPassword(sanitizedValue, formData.confirm_password)
          }));
        }
      }
    } else if (name === 'confirm_password') {
      error = validateConfirmPassword(formData.password || '', sanitizedValue);
    } else if (name === 'contact_no') {
      error = validatePhone(sanitizedValue);
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    let isValid = true;

    if (!isLogin) {
      const firstNameError = validateName('First name', formData.first_name || '');
      const lastNameError = validateName('Last name', formData.last_name || '');
      
      errors.first_name = firstNameError;
      errors.last_name = lastNameError;
      
      if (firstNameError) isValid = false;
      if (lastNameError) isValid = false;

      const phoneError = validatePhone(formData.contact_no || '');
      errors.contact_no = phoneError;
      if (phoneError) isValid = false;

      const confirmPasswordError = validateConfirmPassword(
        formData.password || '', 
        formData.confirm_password || ''
      );
      errors.confirm_password = confirmPasswordError;
      if (confirmPasswordError) isValid = false;
    }

    const emailError = validateEmail(formData.email || '');
    errors.email = emailError;
    if (emailError) isValid = false;
    
    if (formData.password) {
      if (!isLogin) {
        const requirements = validatePassword(formData.password);
        setPasswordRequirements(requirements);
        const passwordError = Object.values(requirements).every(v => v) ? null : 'Password does not meet requirements';
        errors.password = passwordError;
        if (passwordError) isValid = false;
      }
    } else {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const getCookieValue = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
  };

  const ensureCsrfToken = async (): Promise<string> => {
    const existingToken = getCookieValue('XSRF-TOKEN');
    if (existingToken) return existingToken;

    try {
      const response = await fetch(`/api/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error(`CSRF fetch failed with status ${response.status}`);
      await new Promise(resolve => setTimeout(resolve, 100));

      const csrfToken = getCookieValue('XSRF-TOKEN');
      if (!csrfToken) throw new Error('XSRF-TOKEN cookie not found');
      return csrfToken;
    } catch (error) {
      console.error('CSRF Token Error:', error);
      throw new Error('Failed to obtain CSRF token');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const csrfToken = await ensureCsrfToken();
      const payload = isLogin 
        ? {
            email: formData.email,
            password: formData.password,
            remember: rememberMe
          }
        : {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirm_password,
            contact_no: formData.contact_no,
            customer_type: 1
          };

      const response = await fetch(isLogin ? `/api/login` : `/api/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json() as AuthResponse;
      if (!response.ok) throw new Error(data.message || 'Authentication failed');

      localStorage.setItem('access_token', data.access_token);

      if (isLogin) {
        const expires = new Date();
        expires.setDate(expires.getDate() + (rememberMe ? 7 : 1));
        document.cookie = `authToken=${data.access_token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
        login(data);
        // router.push(paths.home);
        window.location.href = paths.home
      } else {
        router.push(paths.login);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      console.error('Authentication error:', err);
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
                  <Box className="form-group" key={field.id}>
                    <Box className="label">
                      <label htmlFor={field.id}>{field.label}</label>
                      {section.forgotButton && (
                        <Link href={section.forgotButton.linkUrl}>
                          {section.forgotButton.linkLabel}
                        </Link>
                      )}
                    </Box>
                    <input
                      type={field.type}
                      name={field.name}
                      id={field.id}
                      required={field.required}
                      onChange={handleInputChange}
                      value={formData[field.name] || ''}
                      maxLength={field.name === 'contact_no' ? 11 : undefined}
                    />
                    {fieldErrors[field.name] && (
                      <Typography color="error" variant="caption" component="div">
                        {fieldErrors[field.name]}
                      </Typography>
                    )}
                    {field.name === 'password' && !isLogin && (
                      <Box mt={1} ml={1}>
                        {!passwordRequirements.hasMinLength && (
                          <Typography variant="caption" component="div" color="text.secondary">
                            • At least 8 characters
                          </Typography>
                        )}
                        {!passwordRequirements.hasUpperCase && (
                          <Typography variant="caption" component="div" color="text.secondary">
                            • At least 1 uppercase letter
                          </Typography>
                        )}
                        {!passwordRequirements.hasLowerCase && (
                          <Typography variant="caption" component="div" color="text.secondary">
                            • At least 1 lowercase letter
                          </Typography>
                        )}
                        {!passwordRequirements.hasNumber && (
                          <Typography variant="caption" component="div" color="text.secondary">
                            • At least 1 number
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                ))}
              </FormWrapper>
            ))}

            {isLogin && (
              <Box className="form-group remember">
                <CheckboxComponent
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

          <Box className="sign-up">
            <Typography component="p">
              {isLogin ? (
                <>Don't have an account? <Link href={paths.register}>Create Account</Link></>
              ) : (
                <>Already have an account? <Link href={paths.login}>Sign In</Link></>
              )}
            </Typography>
          </Box>
        </LoginWrapper>
      </LoginContainer>
    </Login>
  );
}