


'use client';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import LoginBanner from '@/components/LoginBanner';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showBanner, setShowBanner } = useRouteGuard();

  return (
    <>
      {showBanner && (
        <LoginBanner 
          onClose={() => setShowBanner(false)}
          message="Please login to interact with posts and access all features"
        />
      )}
      {children}
    </>
  );
}