import LoginForm from "@/components/forms/Login";

export default function LoginPage() {
  return (
    <div
      className={`min-h-screen bg-linear-to-r from-blue-100 via-white to-blue-200 flex items-center justify-center`}
    >
      <div className="max-w-md  px-5 w-full">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
