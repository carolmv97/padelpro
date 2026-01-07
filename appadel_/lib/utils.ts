// lib/utils.ts

// Función utilitaria para concatenar clases (Tailwind)
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function registerUser({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) throw new Error("Error al registrar usuario")
  return res.json()
}

export async function loginUser({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error("Error al iniciar sesión")
  return res.json()
}


export async function getUserProfile(userId: string) {
  const res = await fetch(`${API_URL}/profile/${userId}`)
  if (!res.ok) throw new Error("Error al cargar perfil")
  return res.json()
}

export async function saveUserProfile(profile: any) {
  if (!profile.id) {
    throw new Error("No se puede guardar el perfil sin un ID de usuario.");
  }
  const res = await fetch(`${API_URL}/profile/${profile.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error("Error al guardar perfil");
  return res.json();
}


export async function addMatchToProfile(userId: string, match: any) {
  const res = await fetch(`${API_URL}/profile/${userId}/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(match),
  })
  if (!res.ok) throw new Error("Error al añadir partido")
  return res.json()
}
