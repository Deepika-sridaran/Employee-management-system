const API_URL = "http://127.0.0.1:5000/leaves";

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
  return body.data;
}

export async function applyLeave(leave) {
  const response = await fetch(`${API_URL}/apply`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(leave),
  });
  return handleResponse(response);
}

export async function getMyLeaves() {
  const response = await fetch(`${API_URL}/my-leaves`, { headers: authHeaders() });
  return handleResponse(response);
}

export async function getAllLeaves() {
  const response = await fetch(API_URL, { headers: authHeaders() });
  return handleResponse(response);
}

export async function approveLeave(id) {
  const response = await fetch(`${API_URL}/${id}/approve`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse(response);
}

export async function rejectLeave(id, reason) {
  const response = await fetch(`${API_URL}/${id}/reject`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({reason}),
  });
  return handleResponse(response);
}