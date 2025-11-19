'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/lib/axiosInstance';
import { loginSchema, type LoginFormData } from '@/schemas/loginSchema';

export default function LoginForm() {
  const router = useRouter();
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
    const response = await login({
      email: data.email,
      password: data.password,
    });

    const accessToken = response.data?.accessToken || response.data?.data?.accessToken;
    const refreshToken = response.data?.refreshToken || response.data?.data?.refreshToken;

    if (!accessToken) {
      throw new Error("No access token received");
    }

    // Save tokens
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    router.push('/dashboard');
  } catch (err: any) {
    console.error('Login failed:', err);
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
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs  md:text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          placeholder="john@example.com"
          className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.email ? 'border-red-500 focus:ring-transparent' : 'border-gray-300 '
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password  */}
      <div>
        <label htmlFor="password" className="block md:text-sm  text-xs font-medium text-gray-700 mb-1">
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full transition-all  bg-black duration-150 hover:bg-neutral-700 cursor-pointer hover:-translate-y-0.5 active:scale-95 text-white p-3 rounded font-medium 
             ${
          isLoading
            ? 'bg-neutral-700 cursor-not-allowed'
            : 'bg-black hover:bg-neutral-700'
        }`}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      {/* Register Link */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-500 hover:underline font-medium">
          Register here
        </a>
      </p>
    </form>
  );
}