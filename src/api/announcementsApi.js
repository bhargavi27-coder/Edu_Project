/**
 * announcementsApi.js
 * REST + real-time (Socket.io) helpers for announcements.
 *
 * Backend routes (mounted at /api/announcements):
 *   GET    /               – list all (admin | hod | faculty | student)
 *   POST   /               – create  (admin | hod | faculty)
 *   PATCH  /:id            – update  (admin | hod | faculty)
 *   DELETE /:id            – delete  (admin | hod | faculty)
 *
 * Socket.io event emitted by the server: "announcement:update"
 */

import { io } from "socket.io-client";
import { API_BASE_URL } from "./config";

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Returns the JWT for whichever role is currently logged in. */
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

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}/api/announcements${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  const data = await parseResponse(res);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

// ─── audience label utility ───────────────────────────────────────────────────

const AUDIENCE_LABELS = {
  all: "Everyone",
  students: "Students",
  faculty: "Faculty",
  hod: "HOD",
  admin: "Admin",
};

/**
 * Returns a human-readable label for an announcement's audience.
 * @param {string} audience
 * @returns {string}
 */
export function announcementAudienceLabel(audience) {
  return AUDIENCE_LABELS[audience] ?? audience ?? "Everyone";
}

/**
 * Formats an ISO date string to a local date-time string.
 * @param {string} iso
 * @returns {string}
 */
export function toLocalDateTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

// ─── socket singleton ─────────────────────────────────────────────────────────

let _socket = null;

function getSocket() {
  if (_socket && _socket.connected) return _socket;

  _socket = io(API_BASE_URL, {
    auth: { token: getToken() },
    transports: ["websocket", "polling"],
    autoConnect: true,
  });

  return _socket;
}

// ─── public API ──────────────────────────────────────────────────────────────

export const announcementsApi = {
  /** Fetch all announcements visible to the current user. */
  getAll() {
    return apiFetch("/");
  },

  /**
   * Create a new announcement.
   * @param {{ title: string, content: string, audience?: string }} values
   */
  create(values) {
    return apiFetch("/", {
      method: "POST",
      body: JSON.stringify(values),
    });
  },

  /**
   * Update an existing announcement.
   * @param {string} id
   * @param {object} values
   */
  update(id, values) {
    return apiFetch(`/${id}`, {
      method: "PATCH",
      body: JSON.stringify(values),
    });
  },

  /**
   * Delete an announcement by ID.
   * @param {string} id
   */
  remove(id) {
    return apiFetch(`/${id}`, { method: "DELETE" });
  },

  /**
   * Subscribe to real-time announcement updates via Socket.io.
   * @param {function} onUpdate  – called with the updated announcement object
   * @returns {function}         – call to unsubscribe
   */
  subscribeToAnnouncementUpdates(onUpdate) {
    const socket = getSocket();

    const handler = (payload) => {
      if (typeof onUpdate === "function") onUpdate(payload);
    };

    socket.on("announcement:update", handler);

    return () => {
      socket.off("announcement:update", handler);
    };
  },
};
