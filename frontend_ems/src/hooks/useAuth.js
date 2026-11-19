import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, token, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    token,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    loading,
  };
};

export default useAuth;
