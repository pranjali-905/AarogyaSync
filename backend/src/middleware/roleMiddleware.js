const { error } = require('../utils/apiResponse');

/**
 * Enforces role-based authorization (RBAC)
 * @param  {...string} allowedRoles ('PATIENT', 'ASHA', 'DOCTOR', 'ADMIN')
 */
const authorizeRoles = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return error(res, 'Authentication required before accessing this protected resource', 401);
    }

    const userRole = String(req.user.role).toUpperCase();

    if (!normalizedAllowed.includes(userRole)) {
      return error(
        res,
        `Access Forbidden: Role '${userRole}' is not authorized to access this healthcare endpoint. Permitted roles: [${normalizedAllowed.join(', ')}]`,
        403
      );
    }

    next();
  };
};

module.exports = authorizeRoles;
