import React, { useState } from 'react';
import { useAuth } from '../providers/UserAuthProvider';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { InputField } from '../components/InputFormFields/InputFormFields';
import { Button } from '../components/Button';

const loginSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('No email entered.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(
      /[!@#$%^&*]/,
      'Password must contain at least one special character.'
    ),
  role: z.string().min(1, 'Role is required.'),
});

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      loginSchema.parse(formData);
      login({ id: '1', ...formData });
      void navigate('/dashboard');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => (fieldErrors[err.path[0]] = err.message));
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <form
        className='bg-white p-6 rounded shadow w-[24rem]'
        onSubmit={handleLogin}
      >
        <h2 className='text-xl font-bold mb-4'>Please Login to WFH Studio</h2>
        <InputField
          label='Name'
          type='text'
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          subLabel='If using an existing email, your name will be updated.'
        />

        <InputField
          label='Email'
          type='email'
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          subLabel='You can log in with existing email'
        />

        <InputField
          label='Password'
          type='password'
          value={formData.password}
          onChange={handleChange('password')}
          error={errors.password}
          subLabel='Password must contain at least 8 characters with a number and special character.'
        />

        <InputField
          label='Role'
          type='text'
          value={formData.role}
          onChange={handleChange('role')}
          error={errors.role}
          subLabel='Position in the company'
          placeholder='e.g. Software Engineer'
        />

        <Button type='submit' text='Login' variant='default' />
      </form>
    </div>
  );
};
