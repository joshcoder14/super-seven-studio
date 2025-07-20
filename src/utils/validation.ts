export interface PasswordRequirements {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
}

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  const stripped = input.replace(/(<([^>]+)>)/gi, '');
  return stripped.replace(/[&<>"'`=\/]/g, function(s) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#x60;',
      '=': '&#x3D;',
      '/': '&#x2F;'
    }[s] as string;
  });
};

export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  return email.replace(/(<([^>]+)>)/gi, '').toLowerCase().trim();
};

export const sanitizePhone = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/\D/g, '').substring(0, 11);
};

// Validation functions
export const validateName = (name: string, value: string): string | null => {
  const sanitized = sanitizeInput(value.trim());
  if (!sanitized) return `${name} is required`;
  if (/\d/.test(sanitized)) return `${name} should not contain numbers`;
  if (sanitized.length < 2) return `${name} should be at least 2 characters`;
  return null;
};

export const validateEmail = (email: string): string | null => {
  const sanitized = sanitizeEmail(email);
  if (!sanitized) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(sanitized)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password: string): PasswordRequirements => {
  const requirements = {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };
  return requirements;
};

export const validatePhone = (phone: string): string | null => {
  const sanitized = sanitizePhone(phone);
  const phRegex = /^(09\d{9}|\+639\d{9})$/;

  if (!sanitized) return 'Phone number is required';
  if (sanitized.length < 10) return 'Phone number should be at least 10 digits';
  if (sanitized.length > 11) return 'Phone number should not exceed 11 digits';
  if (!phRegex.test(phone)) return 'Contact number must be a valid Philippine number (e.g., 09171234567 or +639171234567)';
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};