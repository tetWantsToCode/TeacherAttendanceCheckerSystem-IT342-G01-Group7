// Utility for managing authentication info in localStorage

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("auth"));
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(authData) {
  if (authData)
    localStorage.setItem("auth", JSON.stringify(authData));
  else
    localStorage.removeItem("auth");
}

export function logout() {
  localStorage.removeItem("auth");
}