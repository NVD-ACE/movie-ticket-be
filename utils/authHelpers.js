export const hasPermission = (user, permission) => {
  return user.Role?.permissions?.includes(permission) || false;
};

export const hasAnyPermission = (user, permissions) => {
  const userPermissions = user.Role?.permissions || [];
  return permissions.some(permission => userPermissions.includes(permission));
};

export const hasRole = (user, role) => {
  return user.Role?.name === role;
};

export const hasAnyRole = (user, roles) => {
  return roles.includes(user.Role?.name);
};

export const isHigherOrEqualLevel = (user, targetLevel) => {
  return (user.Role?.level || 0) >= targetLevel;
};