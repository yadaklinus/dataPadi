// app/user/profile/page.tsx
import { getProfileData } from '@/app/actions/user';
import Profile from '@/components/Profile'; // Adjust this path to where your component is
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const result = await getProfileData();

  console.log(result)

  // If the backend returns 401 (Unauthorized), kick back to login [cite: 32]
  if (!result.success || !result.data) {
    redirect('/auth/login');
  }

  // Pass the server-fetched data to the Client Component
  return <Profile initialUser={result.data} />;
}