const BASE = process.env.AUTHENTIK_URL!;
const H = {
  Authorization: `Bearer ${process.env.AUTHENTIK_API_TOKEN!}`,
  "Content-Type": "application/json",
};

// Users
export const listUsers = (search?: string) =>
  fetch(`${BASE}/api/v3/core/users/${search ? `?search=${search}` : ""}`, {
    headers: H,
  }).then((r) => r.json());

export const getUser = (id: number) =>
  fetch(`${BASE}/api/v3/core/users/${id}/`, { headers: H }).then((r) =>
    r.json(),
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
  }).then((r) => r.json());

  await fetch(`${BASE}/api/v3/core/users/${user.pk}/set_password/`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ password: data.password }),
  });
  return user;
};

export const updateUser = (id: number, data: object) =>
  fetch(`${BASE}/api/v3/core/users/${id}/`, {
    method: "PATCH",
    headers: H,
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteUser = (id: number) =>
  fetch(`${BASE}/api/v3/core/users/${id}/`, { method: "DELETE", headers: H });

export const setPassword = (id: number, password: string) =>
  fetch(`${BASE}/api/v3/core/users/${id}/set_password/`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ password }),
  });

// Groups
export const listGroups = () =>
  fetch(`${BASE}/api/v3/core/groups/`, { headers: H }).then((r) => r.json());

export const addToGroup = (groupUuid: string, userId: number) =>
  fetch(`${BASE}/api/v3/core/groups/${groupUuid}/add_user/`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ pk: userId }),
  });

export const removeFromGroup = (groupUuid: string, userId: number) =>
  fetch(`${BASE}/api/v3/core/groups/${groupUuid}/remove_user/`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ pk: userId }),
  });

// Events
export const getEvents = (page = 1) =>
  fetch(`${BASE}/api/v3/events/events/?page=${page}`, { headers: H }).then(
    (r) => r.json(),
  );
