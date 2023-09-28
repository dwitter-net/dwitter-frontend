export interface User {
  id: number;
  username: string;
  avatar: string;
}

export interface LoggedInUser {
  id: number;
  username: string;
  avatar: string;
  email: string;
  is_staff: boolean;
}

export interface DweetComment {
  id: number;
  text: string;
  posted: string;
  author: User;
  reply_to: number;
  deleted: boolean;
}

export interface Dweet {
  id: number;
  deleted: boolean;
  code: string;
  posted: string;
  author: User;
  link: string;
  awesome_count: number;
  has_user_awesomed: boolean;
  remix_of: Dweet | null;
  comments: DweetComment[];
  remixes: number[];
}

export interface Stats {
  dweet_count: number;
  awesome_count: number;
}

export interface ApiList<T> {
  next: string | null;
  previous: string | null;
  count: number;
  results: T[];
}

async function get(path: string) {
  const token = localStorage.getItem('token');
  const response = await fetch(process.env.REACT_APP_API_BASE_URL + path, {
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: 'token ' + token } : {}),
    },
  });
  if (token && response.status === 401) {
    localStorage.removeItem('token');
  }
  if (!response.ok) {
    throw await response.json();
  }
  return await response.json();
}

async function post(path: string, options: { data?: any }) {
  const token = localStorage.getItem('token');
  const response = await fetch(process.env.REACT_APP_API_BASE_URL + path, {
    method: 'post',
    body: JSON.stringify(options.data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: 'token ' + token } : {}),
    },
  });
  if (token && response.status === 401) {
    localStorage.removeItem('token');
  }
  if (!response.ok) {
    throw await response.json();
  }
  return await response.json();
}

async function del(path: string) {
  const token = localStorage.getItem('token');
  const response = await fetch(process.env.REACT_APP_API_BASE_URL + path, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: 'token ' + token } : {}),
    },
  });
  if (token && response.status === 401) {
    localStorage.removeItem('token');
  }
  if (!response.ok) {
    throw await response.json();
  }
  return await response;
}

export async function getDweets(
  order_by: string,
  hashtag: string,
  username: string,
  page: number,
  period: 'week' | 'month' | 'year' | 'all'
): Promise<ApiList<Dweet>> {
  const now = new Date();
  let posted_after = '';
  if (period === 'week') {
    posted_after = new Date(+now - 7 * 24 * 60 * 60 * 1000).toISOString();
  }
  if (period === 'month') {
    posted_after = new Date(+now - 30 * 24 * 60 * 60 * 1000).toISOString();
  }
  if (period === 'year') {
    posted_after = new Date(+now - 365 * 24 * 60 * 60 * 1000).toISOString();
  }
  return get(
    `dweets/?offset=${page * 10}&username=${encodeURIComponent(
      username
    )}&order_by=${encodeURIComponent(order_by)}&hashtag=${encodeURIComponent(
      hashtag
    )}&posted_after=${encodeURIComponent(posted_after)}`
  );
}

export async function getDweet(id: number): Promise<Dweet> {
  return get('dweets/' + id + '/');
}

export async function getComments(id: number): Promise<ApiList<DweetComment>> {
  return get('comments/?page_size=999999&reply_to=' + id);
}

export async function setLike(id: number, like: boolean): Promise<Dweet> {
  return post(`dweets/${id}/set_like/`, {
    data: {
      like,
    },
  });
}

export async function deleteDweet(id: number) {
  return del(`dweets/${id}`);
}

export async function deleteComment(id: number) {
  return del(`comments/${id}`);
}

export async function login(
  username: string,
  password: string
): Promise<{ token: string }> {
  return post('api-token-auth/', { data: { username, password } });
}

export async function register(
  username: string,
  email: string,
  password: string,
  password2: string
) {
  return post('users/', {
    data: {
      username: username,
      email: email,
      password: password,
      password2: password2,
    },
  });
}

export async function getLoggedInUser(): Promise<LoggedInUser> {
  return get('users/me/');
}

export async function getUser(id: string): Promise<User> {
  return get('users/' + id + '/');
}

export async function getStats(id: string): Promise<Stats> {
  return get(`users/${id}/stats/`);
}

export async function addComment(
  dweetId: number,
  text: string
): Promise<Dweet> {
  return post(`dweets/${dweetId}/add_comment/`, {
    data: {
      text: text,
    },
  });
}

export async function reportDweet(dweetId: number) {
  return post(`dweets/${dweetId}/report/`, {
    data: {},
  });
}

export async function reportComment(commentId: number) {
  return post(`comments/${commentId}/report/`, {
    data: {},
  });
}

export async function postDweet(
  code: string,
  comment?: string,
  remix_of?: number
) {
  return post(`dweets/`, {
    data: {
      code,
      'first-comment': comment,
      remix_of: remix_of,
    },
  });
}

export async function setPassword(old_password: string, new_password: string) {
  return post(`users/me/set_password/`, {
    data: {
      old_password,
      new_password,
    },
  });
}

export async function setEmail(email: string) {
  return post(`users/me/set_email/`, {
    data: {
      email,
    },
  });
}
