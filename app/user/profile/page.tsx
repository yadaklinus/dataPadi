export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import { getProfileData } from '@/app/actions/user';
import Profile from '@/components/Profile';
import { redirect } from 'next/navigation';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';

async function ProfileContent() {
  const result = await getProfileData();

  // If the backend returns 401 (Unauthorized), kick back to login
  if (!result.success || !result.data) {
    redirect('/auth/login');
  }

  // Pass the server-fetched data to the Client Component
  return <Profile initialUser={result.data} />;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}