import RegisterForm from '@/components/forms/Register'

const page = () => {
  return (
   <div
         className={`min-h-screen bg-linear-to-r from-blue-100 via-white to-blue-200 flex items-center justify-center`}
       >
         <div className="max-w-md  px-5 w-full">
           <h1 className="text-3xl font-bold mb-6">Register</h1>
           <RegisterForm />
         </div>
       </div>
  )
}

export default page