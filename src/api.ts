export interface User {
  id: number;
  username: string;
  avatar: string;
}

export interface DweetComment {
  id: number;
  text: string;
  posted: string;
  author: User;
  reply_to: number;
}

export interface Dweet {
  id: number;
  code: string;
  posted: string;
  author: User;
  link: string;
  awesome_count: number;
  has_user_awesomed: boolean;
  remix_of: Dweet | null;
  comments: DweetComment[];
}

export interface ApiList<T> {
  next: string | null;
  previous: string | null;
  count: number;
  results: T[];
}

async function get(path: string) {
  const token = localStorage.getItem("token");
  const response = await fetch(process.env.REACT_APP_API_BASE_URL + path, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: "token " + token } : {}),
    },
  });
  if (token && response.status === 401) {
    localStorage.removeItem("token");
  }
  if (!response.ok) {
    throw await response.json();
  }
  return await response.json();
}

async function post(path: string, options: { data?: any }) {
  const token = localStorage.getItem("token");
  const response = await fetch(process.env.REACT_APP_API_BASE_URL + path, {
    method: "post",
    body: JSON.stringify(options.data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: "token " + token } : {}),
    },
  });
  if (token && response.status === 401) {
    localStorage.removeItem("token");
  }
  if (!response.ok) {
    throw await response.json();
  }
  return await response.json();
}

export async function getDweets(
  order_by: string,
  hashtag: string,
  username: string,
  page: number
): Promise<ApiList<Dweet>> {
  return get(
    `dweets/?offset=${page * 10}&username=${encodeURIComponent(
      username
    )}&order_by=${encodeURIComponent(order_by)}&hashtag=${encodeURIComponent(
      hashtag
    )}`
  );
}

export async function getDweet(id: number) {
  return get("dweets/" + id + "/");
}

export async function getComments(id: number): Promise<ApiList<DweetComment>> {
  return get("comments/?page_size=999999&reply_to=" + id);
}

export async function setLike(id: number, like: boolean): Promise<Dweet> {
  return post(`dweets/${id}/set_like/`, {
    data: {
      like,
    },
  });
}

export async function login(
  username: string,
  password: string
): Promise<{ token: string }> {
  return post("api-token-auth/", { data: { username, password } });
}

export async function getUser(id: string): Promise<User> {
  return get("users/" + id + "/");
}

export async function addComment(
  dweetId: number,
  text: string
): Promise<Dweet> {
  return post(`dweets/${dweetId}/add_comment/`, {
    data: {
      text,
    },
  });
}

export async function reportDweet(dweetId: number) {
  return post(`dweets/${dweetId}/report/`, {
    data: {},
  });
}

export async function postDweet(code: string, comment?: string) {
  return post(`dweets/`, {
    data: {
      code,
      "first-comment": comment,
    },
  });
}
