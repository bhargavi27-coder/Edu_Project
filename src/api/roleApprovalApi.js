/**
 * roleApprovalApi.js
 * Helpers for role-based signup approval flows.
 *
 * Backend endpoints:
 *
 *  Students  (facultyApprovalRoutes + studentRoutes, role=faculty):
 *    GET  /api/students/requests           – list pending student signups
 *    PUT  /api/students/requests/:id/approve
 *    PUT  /api/students/requests/:id/reject
 *    GET  /api/students/                   – approved student directory
 *
 *  Faculty  (facultyApprovalRoutes, role=hod):
 *    GET  /api/faculty-approval/requests
 *    PUT  /api/faculty-approval/requests/:id/approve
 *    PUT  /api/faculty-approval/requests/:id/reject
 *    GET  /api/faculty/                    – faculty directory (via hodRoutes)
 *
 *  HOD  (hodApprovalRoutes, role=admin):
 *    GET  /api/hod-approval/requests
 *    PUT  /api/hod-approval/requests/:id/approve
 *    PUT  /api/hod-approval/requests/:id/reject
 *    GET  /api/hod/                        – hod directory (via hodRoutes)
 */

import { API_BASE_URL } from "./config";

// ─── helpers ──────────────────────────────────────────────────────────────────

function getToken() {
  for (const role of ["admin", "hod", "faculty", "student"]) {
    const t = localStorage.getItem(`${role}_token`);
    if (t) return t;
  }
  return null;
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseResponse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function apiFetch(url, options = {}) {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  const data = await parseResponse(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

// ─── route maps ───────────────────────────────────────────────────────────────

const ROLE_ROUTES = {
  // plural keys used by Admin.jsx ("students", "faculty", "hod")
  students: {
    requests: "/api/students/requests",
    approve: (id) => `/api/students/requests/${id}/approve`,
    reject: (id) => `/api/students/requests/${id}/reject`,
    directory: "/api/students/",
  },
  student: {
    requests: "/api/students/requests",
    approve: (id) => `/api/students/requests/${id}/approve`,
    reject: (id) => `/api/students/requests/${id}/reject`,
    directory: "/api/students/",
  },
  faculty: {
    requests: "/api/faculty-approval/requests",
    approve: (id) => `/api/faculty-approval/requests/${id}/approve`,
    reject: (id) => `/api/faculty-approval/requests/${id}/reject`,
    directory: "/api/faculty/",
  },
  hod: {
    requests: "/api/hod-approval/requests",
    approve: (id) => `/api/hod-approval/requests/${id}/approve`,
    reject: (id) => `/api/hod-approval/requests/${id}/reject`,
    directory: "/api/hod/",
  },
};

// ─── public API ───────────────────────────────────────────────────────────────

export const roleApprovalApi = {
  /**
   * List pending signup requests for a role.
   * @param {"student"|"students"|"faculty"|"hod"} role
   */
  list(role) {
    const routes = ROLE_ROUTES[role];
    if (!routes) throw new Error(`Unknown role: ${role}`);
    return apiFetch(routes.requests);
  },

  /**
   * Approve or reject a signup request.
   * @param {"student"|"students"|"faculty"|"hod"} role
   * @param {string} id       – request document ID
   * @param {"approve"|"reject"} decision
   * @param {string} [remarks]
   */
  decide(role, id, decision, remarks) {
    const routes = ROLE_ROUTES[role];
    if (!routes) throw new Error(`Unknown role: ${role}`);
    const url =
      decision === "approve" ? routes.approve(id) : routes.reject(id);
    return apiFetch(url, {
      method: "PUT",
      body: JSON.stringify(remarks !== undefined ? { remarks } : {}),
    });
  },

  /**
   * Fetch the full approved-accounts directory for a role.
   * @param {"student"|"students"|"faculty"|"hod"} role
   */
  directory(role) {
    const routes = ROLE_ROUTES[role];
    if (!routes) throw new Error(`Unknown role: ${role}`);
    return apiFetch(routes.directory);
  },
};
