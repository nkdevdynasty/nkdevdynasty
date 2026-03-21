const BASE = process.env.AUTHENTIK_URL!;
const H = {
  Authorization: `Bearer ${process.env.AUTHENTIK_API_TOKEN!}`,
  "Content-Type": "application/json",
};

async function handleResponse(res: Response, name: string) {
  // Check if response has content before parsing
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    console.error(`Authentik API Error (${name}):`, res.status, data);
    throw new Error(data.detail || data.error || `Failed to ${name}`);
  }
  return data;
}

// Users
export const listUsers = (search?: string) =>
  fetch(`${BASE}/api/v3/core/users/${search ? `?search=${search}` : ""}`, {
    headers: H,
  }).then((r) => handleResponse(r, "listUsers"));

export const getUser = (id: number) =>
  fetch(`${BASE}/api/v3/core/users/${id}/`, { headers: H }).then((r) =>
    handleResponse(r, "getUser"),
  );

export const createUser = async (data: {
  username: string;
  name: string;
  email: string;
  password: string;
  groupUuid: string;
  role: string;
}) => {
  const user = await fetch(`${BASE}/api/v3/core/users/`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({
      username: data.username,
      name: data.name,
      email: data.email,
      is_active: true,
      groups: [data.groupUuid],
      type: "internal",
      attributes: { role: data.role },
    }),
  }).then((r) => handleResponse(r, "createUser"));

  if (user && user.pk) {
    // This endpoint often returns 204 No Content
    await fetch(`${BASE}/api/v3/core/users/${user.pk}/set_password/`, {
      method: "POST",
      headers: H,
      body: JSON.stringify({ password: data.password }),
    }).then((r) => handleResponse(r, "setPassword"));
  }

  return user;
};

export const updateUser = (id: number, data: object) =>
  fetch(`${BASE}/api/v3/core/users/${id}/`, {
    method: "PATCH",
    headers: H,
    body: JSON.stringify(data),
  }).then((r) => handleResponse(r, "updateUser"));

export const deleteUser = (id: number) =>
  fetch(`${BASE}/api/v3/core/users/${id}/`, { method: "DELETE", headers: H });

export const setPassword = (id: number, password: string) =>
  fetch(`${BASE}/api/v3/core/users/${id}/set_password/`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ password }),
  }).then((r) => handleResponse(r, "setPassword"));

// Groups
export const listGroups = (search?: string) => {
  const url = `${BASE}/api/v3/core/groups/${search ? `?search=${search}` : ""}`;
  console.log(`[Authentik] Fetching Groups: ${url}`);
  return fetch(url, { headers: H }).then((r) =>
    handleResponse(r, "listGroups"),
  );
};

export const checkToken = () =>
  fetch(`${BASE}/api/v3/core/users/me/`, { headers: H }).then(async (r) => {
    const data = await handleResponse(r, "checkToken");
    console.log(
      "[Authentik] Full Token Identity Object:",
      JSON.stringify(data, null, 2),
    );
    return data;
  });

export const addToGroup = (groupUuid: string, userId: number) =>
  fetch(`${BASE}/api/v3/core/groups/${groupUuid}/add_user/`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ pk: userId }),
  }).then((r) => handleResponse(r, "addToGroup"));

export const removeFromGroup = (groupUuid: string, userId: number) =>
  fetch(`${BASE}/api/v3/core/groups/${groupUuid}/remove_user/`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ pk: userId }),
  }).then((r) => handleResponse(r, "removeFromGroup"));

// Events
export const getEvents = (page = 1) =>
  fetch(`${BASE}/api/v3/events/events/?page=${page}`, { headers: H }).then(
    (r) => handleResponse(r, "getEvents"),
  );
