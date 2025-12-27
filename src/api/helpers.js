/**
 * Get user's branch ID from localStorage
 */
export const getUserBranchId = () => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.branchId;
    }
  } catch (error) {
    console.error('Error getting branchId from localStorage:', error);
  }
  return null;
};
