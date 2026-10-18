import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { bodyDoublingApi, liveBodyDoublingApi } from '../../services/api';
import { BodyDoublingSession } from '../../types';
import { CheckCircle2, Circle, LogOut } from 'lucide-react';

export const LiveBodyDoublingPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [checklist, setChecklist] = useState<BodyDoublingSession | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = params.get('session');
    if (!id) { setError('No live session is currently available.'); return; }
    liveBodyDoublingApi.joinSession(id).then((result) => {
      setRoomName(result.roomName);
      setSessionId(id);
      setChecklist(result.checklist);
      if (!result.checklist) bodyDoublingApi.getActiveSession().then((response) => setChecklist(response.session));
    }).catch((err: Error) => setError(err.message));
  }, [params]);

  const toggleTask = (id: string) => {
    if (!checklist) return;
    const tasks = checklist.tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
    setChecklist({ ...checklist, tasks });
    bodyDoublingApi.updateSession(checklist._id, { tasks }).catch(() => setError('Unable to save checklist changes.'));
  };

  const leave = async () => {
    if (sessionId) await liveBodyDoublingApi.leaveSession(sessionId).catch(() => {});
    navigate('/dashboard/body-doubling');
  };

  return <div className="space-y-6">
    <div className="flex items-center justify-between border-b border-sand/70 pb-4">
      <div><h1 className="font-serif text-3xl font-bold text-deepBrown">Live Body Doubling</h1><p className="text-xs text-secondaryText mt-1">A calm space to focus alongside others.</p></div>
      <button onClick={leave} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-sand text-xs text-secondaryText"><LogOut className="w-4 h-4" /> Leave</button>
    </div>
    {error ? <div className="p-6 rounded-2xl border border-sand bg-cream text-sm text-secondaryText">{error}</div> : <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-sand bg-deepBrown min-h-[420px]">
        {roomName && <iframe title="Live Body Doubling video call" src={`https://${import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si'}/${roomName}`} allow="camera; microphone; fullscreen; display-capture" className="w-full h-[520px]" />}
      </div>
      <div className="bg-ivory border border-sand rounded-2xl p-6">
        <h2 className="font-serif text-xl font-bold text-deepBrown">My Session Checklist</h2>
        <p className="text-xs text-secondaryText mt-1 mb-5">Your existing checklist stays with you in the live session.</p>
        <div className="space-y-2">{checklist?.tasks.map((task) => <button key={task.id} onClick={() => toggleTask(task.id)} className="w-full flex items-center gap-2 p-3 rounded-xl border border-sand text-left text-sm">{task.completed ? <CheckCircle2 className="w-4 h-4 text-terracotta" /> : <Circle className="w-4 h-4 text-secondaryText" />}<span className={task.completed ? 'line-through text-secondaryText' : 'text-deepBrown'}>{task.text}</span></button>)}</div>
        <p className="mt-6 text-xs text-secondaryText">Session timer follows the facilitator's live room.</p>
      </div>
    </div>}
  </div>;
};
