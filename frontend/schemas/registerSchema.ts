import { z } from "zod";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Full Name validation
export const fullNameValidation = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters")
  .max(20, "Full name must not exceed 20 characters")
  .regex(
    /^[A-Za-z]+(?: [A-Za-z]+)*$/,
    "Full name must not contain special characters or numbers"
  );

// Email validation
export const emailValidation = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

// Username validation
export const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must not exceed 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );

// Password validation
export const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(14, "Password must not exceed 14 characters");

// Avatar validation - SIMPLIFIED VERSION
export const avatarValidation = z
  .any()
  .refine((files) => {
    // Check if file exists
    if (!files || files.length === 0) {
      return false;
    }
    return true;
  }, "Avatar image is required")
  .refine((files) => {
    // Check file size (5MB max)
    const file = files?.[0];
    if (!file) return false;
    return file.size <= MAX_FILE_SIZE;
  }, "Avatar size must be less than 5MB")
  .refine((files) => {
    // Check file type
    const file = files?.[0];
    if (!file) return false;
    return ALLOWED_IMAGE_TYPES.includes(file.type);
  }, "Avatar must be a JPEG, PNG, or WEBP image");

// Register Schema
export const registerSchema = z.object({
  fullName: fullNameValidation,
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
  avatar: avatarValidation,
});

export type RegisterFormData = z.infer<typeof registerSchema>;