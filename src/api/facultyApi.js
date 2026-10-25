import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("facultyToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getData = async (request) => (await request).data;

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("facultyUser") || "null");
  } catch {
    return null;
  }
};

export const facultyApi = {
  async login(email, password) {
    const data = await getData(client.post("/faculty/login", { email, password }));
    const user = data.faculty || data.user;
    if (data.token) localStorage.setItem("facultyToken", data.token);
    if (user) localStorage.setItem("facultyUser", JSON.stringify(user));
    return data;
  },

  signup: (details) => getData(client.post("/faculty/signup", details)),

  logout() {
    localStorage.removeItem("facultyToken");
    localStorage.removeItem("facultyUser");
  },

  getCurrentUser,
  getProfile: () => getData(client.get("/faculty/profile")),
  getDashboard: () => getData(client.get("/faculty/dashboard")),
  getOutpasses: () => getData(client.get("/faculty/outpasses")),
  getStudents: (search, branch, semester) =>
    getData(client.get("/faculty/students", { params: { search, branch, semester } })),
  getAttendanceRecords: (date, subject, className) =>
    getData(client.get("/faculty/attendance", { params: { date, subject, class: className } })),
  markAttendance: (attendance) => getData(client.post("/faculty/attendance", attendance)),
  getNotes: (search, subject) =>
    getData(client.get("/faculty/notes", { params: { search, subject } })),
  uploadNote: (note) => getData(client.post("/faculty/notes", note)),
  deleteNote: (id) => getData(client.delete(`/faculty/notes/${id}`)),
  getAssignments: () => getData(client.get("/faculty/assignments")),
  createAssignment: (assignment) => getData(client.post("/faculty/assignments", assignment)),
  gradeSubmission: (assignmentId, submissionId, marks, feedback) =>
    getData(client.patch(`/faculty/assignments/${assignmentId}/submissions/${submissionId}`, { marks, feedback })),
  getAnnouncements: () => getData(client.get("/faculty/announcements")),
  postAnnouncement: (announcement) => getData(client.post("/faculty/announcements", announcement)),
  deleteAnnouncement: (id) => getData(client.delete(`/faculty/announcements/${id}`)),
  approveOutpass: (id, remarks) =>
    getData(client.patch(`/faculty/outpasses/${id}/approve`, { remarks })),
  rejectOutpass: (id, remarks) =>
    getData(client.patch(`/faculty/outpasses/${id}/reject`, { remarks })),
  updateProfile: (profile) => getData(client.put("/faculty/profile", profile)),
  changePassword: (currentPassword, newPassword) =>
    getData(client.put("/faculty/change-password", { currentPassword, newPassword }))
};