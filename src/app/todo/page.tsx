'use client';

import { FormEvent, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
  id: number;
  text: string;
  done: boolean;
}

export default function TodoPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState('');

  const getToken = () => {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('token='));
    return cookie ? cookie.split('=')[1] : null;
  };

  const fetchTasks = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (err) {
      setError('Failed to load tasks');
    }
  }, [router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newTask }),
      });

      if (res.ok) {
        setNewTask('');
        fetchTasks();
      } else if (res.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to create task');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const toggleTask = async (id: number, done: boolean) => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, done }),
      });

      if (res.ok) {
        fetchTasks();
      } else if (res.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to update task');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white/80 shadow-xl rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">Mes Tâches</h1>
          {error && (
            <div className="bg-red-50 p-4 rounded-xl mb-6 border border-red-200">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Ajouter une nouvelle tâche..."
                className="flex-1 p-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-purple-400 text-purple-900 text-lg bg-white/90"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold shadow-sm hover:shadow-md disabled:opacity-50"
              >
                Ajouter
              </button>
            </div>
          </form>

          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 p-4 bg-purple-50/80 rounded-xl hover:bg-purple-50 transition-colors group"
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={(e) => toggleTask(task.id, e.target.checked)}
                  className="h-5 w-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500 transition-all"
                />
                <span 
                  className={`flex-1 transition-all ${
                    task.done 
                      ? 'line-through text-purple-400' 
                      : 'text-purple-900'
                  }`}
                >
                  {task.text}
                </span>
                {task.done && (
                  <span className="text-green-500 text-sm font-medium bg-green-100 px-3 py-1 rounded-full">
                    Terminée ✓
                  </span>
                )}
              </li>
            ))}
            {tasks.length === 0 && (
              <li className="text-center text-purple-400 py-8">
                Aucune tâche pour le moment. Commencez par en ajouter une !
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
