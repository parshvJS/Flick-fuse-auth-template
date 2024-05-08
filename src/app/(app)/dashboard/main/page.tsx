'use client'
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';

const UserProfile = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = () => {
      console.log(session, status, "is sesstion")
    }
    fetchData()
  }, [])

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div>
        <p>You are not logged in.</p>
        <button onClick={() => signIn()}>Log In</button>
      </div>
    );
  }

  return (
    <div>
      <p>Email: {session?.user?.email}</p>
      <button onClick={() => signOut()}>Log Out</button>
    </div>
  );
};

export default UserProfile;
