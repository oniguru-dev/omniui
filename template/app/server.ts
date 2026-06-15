'use server';

export async function getServerTime() {
  const now = new Date(); return {
    time: now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    date: now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
    server: 'Omni UI',
  };
}
