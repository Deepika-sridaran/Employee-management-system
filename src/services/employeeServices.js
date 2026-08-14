const API_URL = "http://127.0.0.1:5000/employees";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response) {
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message || "Request failed");
  }
  return body.data; // unwrap { success, message, data } -> just the data
}

export async function getAllEmployees() {
  const response = await fetch(API_URL, { headers: authHeaders() });
  return handleResponse(response);
}

export async function getEmployeeById(id) {
  // Note: your backend doesn't have a GET /employees/<id> route yet —
  // only list-all, update, and delete. We may need to add one, or
  // filter client-side from getAllEmployees() for now.
  const employees = await getAllEmployees();
  const match = employees.find((e) => e.employee_id === id);
  if (!match) throw new Error("Employee not found");
  return match;
}

export async function createEmployee(employee) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(employee),
  });
  return handleResponse(response);
}

export async function updateEmployee(id, employee) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(employee),
  });
  return handleResponse(response);
}

export async function getAllDepartments() {
    const response = await fetch("http://127.0.0.1:5000/departments",
         {headers: authHeaders(),});
         return handleResponse(response);
}

export async function deleteEmployee(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message || "Failed to delete employee");
  }
  return body.message;
}
