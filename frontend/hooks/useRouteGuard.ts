

// 'use client';
// import { useEffect, useState } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// import { useAuth } from '@/app/context/AuthContext';

// export const useRouteGuard = () => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { isLoggedIn, isLoading } = useAuth();
//   const [showBanner, setShowBanner] = useState(false);

//   // Pages that require authentication
//   const protectedPages = ['/dashboard', '/profile', '/settings', '/create-post'];
  
//   // Pages that show banner but don't redirect immediately
//   const bannerPages = ['/explore', '/posts', '/trending'];

//   useEffect(() => {
//     if (isLoading) return;

//     const currentPath = pathname;
    
//     // If it's a protected page and user is not logged in, redirect to home
//     if (protectedPages.includes(currentPath) && !isLoggedIn) {
//       router.push('/');
//       return;
//     }

//     // If it's a banner page and user is not logged in, show banner
//     if (bannerPages.includes(currentPath) && !isLoggedIn) {
//       setShowBanner(true);
//     } else {
//       setShowBanner(false);
//     }
//   }, [pathname, isLoggedIn, isLoading, router]);

//   return {
//     showBanner,
//     setShowBanner,
//     isLoggedIn,
//     isLoading
//   };
// };