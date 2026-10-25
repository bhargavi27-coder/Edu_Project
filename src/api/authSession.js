/**
 * authSession.js
 * Utility helpers for storing, clearing, and checking role-based auth sessions.
 * Data is persisted in localStorage under role-namespaced keys.
 */

const TOKEN_KEY = (role) => `${role}_token`;
const USER_KEY  = (role) => `${role}_user`;

/**
 * Store a login response for a specific role.
 * @param {Object} result - API response containing at least { token, ... }
 * @param {string} role   - e.g. "student" | "faculty" | "hod" | "admin"
 */
export function storeAuthSession(result, role) {
  if (result?.token) {
    localStorage.setItem(TOKEN_KEY(role), result.token);
  }
  const user = result?.user ?? result?.student ?? result?.faculty ?? result?.hod ?? result?.admin ?? null;
  if (user) {
    localStorage.setItem(USER_KEY(role), JSON.stringify(user));
  }
}

/**
 * Check whether a valid session token exists for the given role.
 * @param {string} role
 * @returns {boolean}
 */
export function hasRoleSession(role) {
  return !!localStorage.getItem(TOKEN_KEY(role));
}

/**
 * Clear the session for a specific role, or all roles if none is provided.
 * @param {string} [role]
 */
export function clearAuthSession(role) {
  if (role) {
    localStorage.removeItem(TOKEN_KEY(role));
    localStorage.removeItem(USER_KEY(role));
  } else {
    // Clear sessions for all known roles
    ["student", "faculty", "hod", "admin"].forEach((r) => {
      localStorage.removeItem(TOKEN_KEY(r));
      localStorage.removeItem(USER_KEY(r));
    });
  }
}

/**
 * Retrieve the stored user object for a given role.
 * @param {string} role
 * @returns {Object|null}
 */
export function getAuthUser(role) {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY(role)) || "null");
  } catch {
    return null;
  }
}

/**
 * Retrieve the stored token for a given role.
 * @param {string} role
 * @returns {string|null}
 */
export function getAuthToken(role) {
  return localStorage.getItem(TOKEN_KEY(role));
}
