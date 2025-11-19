'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/lib/axiosInstance';
import { loginSchema, type LoginFormData } from '@/schemas/loginSchema';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', data);
      
      const response = await login({
        email: data.email,
        password: data.password,
      });

      console.log('Login API response:', response);

      if (response.success) {
        console.log('Login successful, updating auth context...');
        
        // Update auth context (this will handle storage and state)
        authLogin(response);
        
        // The redirect happens in AuthContext, but we'll add a backup
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
        
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error details:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Your form JSX remains the same */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          placeholder="john@example.com"
          className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.email ? 'border-red-500 focus:ring-transparent' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block md:text-sm text-xs font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          placeholder="••••••••"
          className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.password ? 'border-red-500 focus:ring-transparent' : 'border-gray-300'
          }`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full transition-all bg-black duration-150 hover:bg-neutral-700 cursor-pointer hover:-translate-y-0.5 active:scale-95 text-white p-3 rounded font-medium ${
          isLoading ? 'bg-neutral-700 cursor-not-allowed' : 'bg-black hover:bg-neutral-700'
        }`}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-500 hover:underline font-medium">
          Register here
        </a>
      </p>
    </form>
  );
}