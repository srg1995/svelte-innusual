<script lang="ts">
	type Task = { id: number; text: string; done: boolean };
	type Filter = 'all' | 'pending' | 'done';

	let tasks = $state<Task[]>([]);
	let text = $state('');
	let filter = $state<Filter>('all');

	let visible = $derived(
		filter === 'all' ? tasks : tasks.filter((t) => (filter === 'done' ? t.done : !t.done))
	);
	let pending = $derived(tasks.filter((t) => !t.done).length);

	$effect(() => localStorage.setItem('tasks', JSON.stringify(tasks)));

	function add(e: SubmitEvent) {
		e.preventDefault();
		if (!text.trim()) return;
		tasks.push({ id: Date.now(), text, done: false });
		text = '';
	}

	function remove(id: number) {
		tasks = tasks.filter((t) => t.id !== id);
	}
</script>

<form onsubmit={add}>
	<input bind:value={text} placeholder="Nueva tarea" />
	<button>Añadir</button>
</form>

<select bind:value={filter}>
	<option value="all">Todas</option>
	<option value="pending">Pendientes</option>
	<option value="done">Hechas</option>
</select>

<ul>
	{#each visible as task (task.id)}
		<li>
			<input type="checkbox" bind:checked={task.done} />
			<input bind:value={task.text} />
			<button onclick={() => remove(task.id)}>✕</button>
		</li>
	{/each}
</ul>

<p>Pendientes: {pending}</p>

<!-- 

--- Como seria el codigo en React ---

import { useEffect, useMemo, useState, type FormEvent } from 'react';

type Task = { id: number; text: string; done: boolean };
type Filter = 'all' | 'pending' | 'done';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? tasks : tasks.filter((t) => (filter === 'done' ? t.done : !t.done))),
    [tasks, filter]
  );
  const pending = useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function add(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setTasks((prev) => [...prev, { id: Date.now(), text, done: false }]);
    setText('');
  }

  function toggle(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function rename(id: number, newText: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  }

  function remove(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <>
      <form onSubmit={add}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Nueva tarea" />
        <button>Añadir</button>
      </form>

      <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
        <option value="all">Todas</option>
        <option value="pending">Pendientes</option>
        <option value="done">Hechas</option>
      </select>

      <ul>
        {visible.map((task) => (
          <li key={task.id}>
            <input type="checkbox" checked={task.done} onChange={() => toggle(task.id)} />
            <input value={task.text} onChange={(e) => rename(task.id, e.target.value)} />
            <button onClick={() => remove(task.id)}>✕</button>
          </li>
        ))}
      </ul>

      <p>Pendientes: {pending}</p>
    </>
  );
} -->
