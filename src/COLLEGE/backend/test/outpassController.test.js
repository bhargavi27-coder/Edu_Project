const { afterEach, test } = require("node:test");
const assert = require("node:assert/strict");

const OutpassRequest = require("../models/OutpassRequest");
const Student = require("../models/Student");
const {
  getHODOutpassRequests,
  updateOutpassRequest,
} = require("../controllers/outpassController");

const originalMethods = {
  outpassFind: OutpassRequest.find,
  outpassFindOne: OutpassRequest.findOne,
  studentFind: Student.find,
};

const invoke = async (controller, { user = {}, reviewer, params = {}, body = {} }) => {
  let statusCode;
  let responseBody;
  const response = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(value) {
      responseBody = value;
      return this;
    },
  };
  await controller({ user, reviewer, params, body }, response);
  return { statusCode, body: responseBody };
};

afterEach(() => {
  OutpassRequest.find = originalMethods.outpassFind;
  OutpassRequest.findOne = originalMethods.outpassFindOne;
  Student.find = originalMethods.studentFind;
});

test("HOD can list only outpasses for active students in their department", async () => {
  let studentFilter;
  let outpassFilter;
  Student.find = (filter) => {
    studentFilter = filter;
    return {
      select: async () => [{ _id: "student-cse" }],
    };
  };
  OutpassRequest.find = (filter) => {
    outpassFilter = filter;
    return {
      populate() { return this; },
      sort() { return this; },
      lean: async () => [{ _id: "outpass-1" }],
    };
  };

  const result = await invoke(getHODOutpassRequests, {
    reviewer: { _id: "hod-id", department: "CSE" },
  });

  assert.equal(result.statusCode, 200);
  assert.deepEqual(studentFilter, { branch: "CSE", isActive: true });
  assert.deepEqual(outpassFilter, { student: { $in: ["student-cse"] } });
  assert.equal(result.body.outpasses.length, 1);
});

test("HOD can approve a department outpass and is recorded as the reviewer", async () => {
  const id = "65f0c0a12345678901234567";
  let studentFilter;
  let outpassFilter;
  const outpass = {
    _id: id,
    status: "PENDING",
    save: async () => {},
  };
  Student.find = (filter) => {
    studentFilter = filter;
    return {
      select: async () => [{ _id: "student-cse" }],
    };
  };
  OutpassRequest.findOne = async (filter) => {
    outpassFilter = filter;
    return outpass;
  };

  const result = await invoke(updateOutpassRequest, {
    user: { userId: "hod-id", role: "hod" },
    reviewer: { _id: "hod-id", department: "CSE" },
    params: { id },
    body: { status: "APPROVED", remarks: "Approved." },
  });

  assert.equal(result.statusCode, 200);
  assert.deepEqual(studentFilter, { branch: "CSE", isActive: true });
  assert.deepEqual(outpassFilter, { _id: id, student: { $in: ["student-cse"] } });
  assert.equal(outpass.status, "APPROVED");
  assert.equal(outpass.reviewedBy, "hod-id");
  assert.equal(outpass.reviewedByModel, "HOD");
  assert.equal(outpass.rejectionReason, "");
  assert.ok(outpass.reviewedAt instanceof Date);
});

test("HOD cannot update an outpass outside their department", async () => {
  const id = "65f0c0a12345678901234567";
  let outpassFilter;
  Student.find = () => ({
    select: async () => [{ _id: "other-department-student" }],
  });
  OutpassRequest.findOne = async (filter) => {
    outpassFilter = filter;
    return null;
  };

  const result = await invoke(updateOutpassRequest, {
    user: { userId: "hod-id", role: "hod" },
    reviewer: { _id: "hod-id", department: "CSE" },
    params: { id },
    body: { status: "REJECTED", remarks: "Out of scope" },
  });

  assert.equal(result.statusCode, 404);
  assert.deepEqual(outpassFilter, {
    _id: id,
    student: { $in: ["other-department-student"] },
  });
});
