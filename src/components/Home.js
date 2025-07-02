import React from 'react';
import { useAuth } from "../Auth/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  return (
    <React.Fragment>
        {isAuthenticated ? (
          <>Welcome, {user.name}!</>
        ) : (
          <>Login to see the authenticated home page.</>
        )}
    </React.Fragment>
  )
}
