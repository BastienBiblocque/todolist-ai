

"use client";
import React, { useEffect, useState } from "react";

export default function Home() {
  type Task = { id: number; text: string; done: boolean };
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch("/api/tasks", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setInitialLoading(false));
  }, [token]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const action = isRegister ? "register" : "login";
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, action })
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      setEmail("");
      setPassword("");
      setIsRegister(false);
    } else {
      setLoginError(data.error || (isRegister ? "Erreur d'inscription" : "Erreur de connexion"));
    }
  };

  const handleLogout = () => {
    setToken(null);
    setTasks([]);
    setEmail("");
    setPassword("");
    setLoginError("");
  };

  const addTask = async () => {
    if (input.trim() && token) {
      setLoading(true);
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: input.trim() })
      });
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setInput("");
      setLoading(false);
    }
  };

  const toggleTask = async (idx: number) => {
    if (!token) return;
    const task = tasks[idx];
    setLoading(true);
    const res = await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: task.id, done: !task.done })
    });
    const updated = await res.json();
    setTasks(tasks.map((t, i) => i === idx ? updated : t));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center font-sans p-4">
      {!token ? (
        <form className="bg-white/80 shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col gap-6" onSubmit={handleAuth}>
          <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">{isRegister ? "Inscription" : "Connexion"} Todolist</h1>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          {loginError && <div className="text-red-500 text-center text-sm">{loginError}</div>}
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            {isRegister ? "S'inscrire" : "Se connecter"}
          </button>
          <button
            type="button"
            className="text-purple-600 underline text-sm mt-2"
            onClick={() => { setIsRegister(r => !r); setLoginError(""); }}
          >
            {isRegister ? "Déjà inscrit ? Se connecter" : "Pas encore de compte ? S'inscrire"}
          </button>
        </form>
      ) : (
        <div className="bg-white/80 shadow-xl rounded-2xl p-8 w-full max-w-md">
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-200"
          >
            Se déconnecter
          </button>
          <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">Ma Todolist</h1>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="Ajouter une tâche..."
              className="flex-1 px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={addTask}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              {loading ? "..." : "Ajouter"}
            </button>
          </div>
          <ul className="space-y-3">
            {initialLoading ? (
              <li className="text-center text-purple-400 animate-pulse">Chargement des tâches...</li>
            ) : tasks.length === 0 ? (
              <li className="text-gray-400 text-center">Aucune tâche pour l&apos;instant.</li>
            ) : (
              tasks.map((task, idx) => (
                <li key={task.id} className="flex items-center justify-between bg-purple-50 rounded-lg px-4 py-2 shadow">
                  <span className={`text-purple-800 transition-all duration-200 ${task.done ? 'line-through text-gray-400' : ''}`}>{task.text}</span>
                  <button
                    onClick={() => toggleTask(idx)}
                    className={`ml-4 text-xs px-3 py-1 rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-purple-400 ${task.done ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                    aria-label={task.done ? 'Marquer comme à faire' : 'Marquer comme terminée'}
                    disabled={loading || task.done}
                  >
                    {task.done ? '✔️ Terminée' : 'Terminer'}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      <footer className="mt-8 text-xs text-gray-500 text-center">
        © {new Date().getFullYear()} Todolist Next.js — Design moderne sans base de données
      </footer>
    </div>
  );
}
