'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerUser } from '@/lib/axiosInstance';
import { registerSchema, type RegisterFormData } from '@/schemas/registerSchema';

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    
  setIsLoading(true);
  setError('');

  try {
    await registerUser({
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      password: data.password,
      avatar: data.avatar[0], // Extract File from FileList
    });
    
    router.push('/login?registered=true');
  } catch (err: any) {
    console.error('Registration failed:', err);
    setError(err.response?.data?.message || 'Registration failed. Please try again.');
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

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          {...register('fullName')}
          type="text"
          id="fullName"
          placeholder="John Doe"
          className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.fullName ? 'border-red-500 focus:ring-transparent' : 'border-gray-300'
          }`}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          {...register('username')}
          type="text"
          id="username"
          placeholder="johndoe"
          className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.username ? 'border-red-500 focus:ring-transparent' : 'border-gray-300'
          }`}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      {/* Email */}
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

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
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

    

      {/* Avatar Upload */}
      <div>
        <label htmlFor="avatar" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
          Avatar
        </label>
        <input
          {...register('avatar')}
          type="file"
          id="avatar"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.avatar ? 'border-red-500 focus:ring-transparent' : 'border-gray-300'
          }`}
        />
        {errors.avatar && (
          <p className="mt-1 text-sm text-red-600">{errors.avatar.message as string}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">Max file size: 5MB. Formats: JPG, PNG, WEBP</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full transition-all bg-black duration-150 hover:bg-neutral-700 cursor-pointer hover:-translate-y-0.5 active:scale-95 text-white p-3 rounded font-medium ${
          isLoading ? 'bg-neutral-700 cursor-not-allowed' : 'bg-black hover:bg-neutral-700'
        }`}
      >
        {isLoading ? 'Creating account...' : 'Register'}
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-500 hover:underline font-medium">
          Login here
        </a>
      </p>
    </form>
  );
}