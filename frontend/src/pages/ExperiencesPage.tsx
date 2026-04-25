import { useState, useEffect, useCallback } from 'react';
import {
  MapPin, Star, Heart, Plus, X, Trash2, ChevronDown,
  PlusCircle, MinusCircle, Send, Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';

interface ExperiencePoint {
  id: string;
  name: string;
  description: string;
  rating: number;
  sortOrder: number;
}

interface ExperienceUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

interface Experience {
  id: string;
  cityName: string;
  title: string;
  description: string;
  overallRating: number;
  createdAt: string;
  user: ExperienceUser;
  points: ExperiencePoint[];
  likeCount: number;
  likedByMe: boolean;
}

const POPULAR_CITIES = [
  'Jaipur', 'Delhi', 'Mumbai', 'Goa', 'Varanasi', 'Udaipur',
  'Bangalore', 'Kolkata', 'Chennai', 'Agra', 'Rishikesh', 'Manali',
];

function StarRating({ value, onChange, size = 'md' }: {
  value: number;
  onChange?: (v: number) => void;
  size?: 'sm' | 'md';
}) {
  const dim = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            className={`${dim} ${n <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );
}

function AuthorAvatar({ user }: { user: ExperienceUser }) {
  const initials = [user.firstName, user.lastName]
    .filter(Boolean).map(s => s![0]).join('').toUpperCase() || user.email[0].toUpperCase();
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ background: '#085041' }}
    >
      {initials}
    </div>
  );
}

function ExperienceCard({ exp, onLike, onDelete, currentUserId }: {
  exp: Experience;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  currentUserId?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const authorName = [exp.user.firstName, exp.user.lastName].filter(Boolean).join(' ') || exp.user.email;
  const timeAgo = getTimeAgo(exp.createdAt);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-start gap-3 p-5 pb-3">
        <AuthorAvatar user={exp.user} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {authorName}
            </span>
            <span className="text-xs text-gray-400">{timeAgo}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3 w-3" style={{ color: '#1D9E75' }} />
            {exp.cityName}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StarRating value={exp.overallRating} size="sm" />
        </div>
      </div>

      {/* Title & Description */}
      <div className="px-5 pb-3">
        <h3 className="mb-1.5 text-lg font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {exp.title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-600">{exp.description}</p>
      </div>

      {/* Points */}
      {exp.points.length > 0 && (
        <div className="mx-5 mb-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition"
            style={{ background: '#E1F5EE', color: '#085041' }}
          >
            <span>{exp.points.length} location{exp.points.length > 1 ? 's' : ''} reviewed</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>

          {expanded && (
            <div className="mt-2 space-y-2">
              {exp.points.map(pt => (
                <div key={pt.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" style={{ color: '#1D9E75' }} />
                      <span className="text-sm font-semibold text-gray-800">{pt.name}</span>
                    </div>
                    <StarRating value={pt.rating} size="sm" />
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{pt.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
        <button
          onClick={() => onLike(exp.id)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            exp.likedByMe
              ? 'text-rose-500'
              : 'text-gray-400 hover:text-rose-400'
          }`}
        >
          <Heart className={`h-4 w-4 ${exp.likedByMe ? 'fill-rose-500' : ''}`} />
          {exp.likeCount}
        </button>
        {currentUserId === exp.user.id && (
          <button
            onClick={() => onDelete(exp.id)}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-gray-400 transition hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

interface PointDraft {
  name: string;
  description: string;
  rating: number;
}

function CreateExperienceForm({ onCreated, onClose }: {
  onCreated: () => void;
  onClose: () => void;
}) {
  const { token } = useAuth();
  const [cityName, setCityName] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [overallRating, setOverallRating] = useState(0);
  const [points, setPoints] = useState<PointDraft[]>([{ name: '', description: '', rating: 0 }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addPoint = () => setPoints(prev => [...prev, { name: '', description: '', rating: 0 }]);
  const removePoint = (i: number) => setPoints(prev => prev.filter((_, idx) => idx !== i));
  const updatePoint = (i: number, field: keyof PointDraft, value: string | number) =>
    setPoints(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const city = cityName === '__custom' ? customCity : cityName;
    if (!city.trim()) { setError('Please select a city.'); return; }
    if (!title.trim()) { setError('Please add a title.'); return; }
    if (!description.trim()) { setError('Please add a description.'); return; }
    if (overallRating < 1) { setError('Please rate the city overall.'); return; }
    const validPoints = points.filter(p => p.name.trim());
    if (validPoints.length === 0) { setError('Add at least one location point.'); return; }
    for (const p of validPoints) {
      if (p.rating < 1) { setError(`Please rate "${p.name}".`); return; }
      if (!p.description.trim()) { setError(`Please describe "${p.name}".`); return; }
    }

    setSubmitting(true);
    try {
      await api.post('/experiences', {
        cityName: city.trim(),
        title: title.trim(),
        description: description.trim(),
        overallRating,
        points: validPoints,
      }, token);
      onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create experience');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-20">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Share Your Experience
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
          )}

          {/* City */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">City</label>
            <select
              value={cityName}
              onChange={e => setCityName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-[#1D9E75]"
            >
              <option value="">Select a city</option>
              {POPULAR_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="__custom">Other (type below)</option>
            </select>
            {cityName === '__custom' && (
              <input
                type="text"
                placeholder="Enter city name"
                value={customCity}
                onChange={e => setCustomCity(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#1D9E75]"
              />
            )}
          </div>

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">Title</label>
            <input
              type="text"
              placeholder="e.g. A magical weekend in Jaipur"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#1D9E75]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">Description</label>
            <textarea
              rows={3}
              placeholder="Share your overall experience of the city..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#1D9E75]"
            />
          </div>

          {/* Overall Rating */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Overall City Rating
            </label>
            <StarRating value={overallRating} onChange={setOverallRating} />
          </div>

          {/* Location Points */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Location Points
              </label>
              <button
                type="button"
                onClick={addPoint}
                className="flex items-center gap-1 text-xs font-medium transition"
                style={{ color: '#1D9E75' }}
              >
                <PlusCircle className="h-4 w-4" /> Add Point
              </button>
            </div>
            <div className="space-y-3">
              {points.map((pt, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: '#1D9E75' }} />
                    <input
                      type="text"
                      placeholder="Location name (e.g. Hawa Mahal)"
                      value={pt.name}
                      onChange={e => updatePoint(i, 'name', e.target.value)}
                      className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-gray-400"
                    />
                    {points.length > 1 && (
                      <button type="button" onClick={() => removePoint(i)} className="text-gray-400 hover:text-red-400">
                        <MinusCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Describe your experience at this location..."
                    value={pt.description}
                    onChange={e => updatePoint(i, 'description', e.target.value)}
                    className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Rating:</span>
                    <StarRating value={pt.rating} onChange={v => updatePoint(i, 'rating', v)} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ background: '#085041' }}
          >
            <Send className="h-4 w-4" />
            {submitting ? 'Publishing...' : 'Publish Experience'}
          </button>
        </form>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function ExperiencesPage() {
  const { token, isSignedIn, user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const params = cityFilter ? `?city=${encodeURIComponent(cityFilter)}` : '';
      const res = await api.get<{ success: boolean; data: Experience[] }>(
        `/experiences${params}`, token,
      );
      setExperiences(res.data);
    } catch {
      // silently fail for listing
    } finally {
      setLoading(false);
    }
  }, [cityFilter, token]);

  useEffect(() => { fetchExperiences(); }, [fetchExperiences]);

  const handleLike = async (id: string) => {
    if (!isSignedIn) return;
    try {
      const res = await api.post<{ success: boolean; liked: boolean }>(`/experiences/${id}/like`, {}, token);
      setExperiences(prev =>
        prev.map(e =>
          e.id === id
            ? { ...e, likedByMe: res.liked, likeCount: e.likeCount + (res.liked ? 1 : -1) }
            : e,
        ),
      );
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    try {
      await api.delete(`/experiences/${id}`, token);
      setExperiences(prev => prev.filter(e => e.id !== id));
    } catch {
      // ignore
    }
  };

  const uniqueCities = Array.from(new Set(experiences.map(e => e.cityName)));

  return (
    <main>
      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 pb-12 pt-14"
        style={{ background: 'linear-gradient(135deg, #063d31 0%, #0f7a59 50%, #1D9E75 100%)' }}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-10" style={{ background: '#fff' }} />
        <div className="pointer-events-none absolute -left-10 bottom-10 h-48 w-48 rounded-full opacity-5" style={{ background: '#fff' }} />

        <div className="relative mx-auto max-w-5xl text-center">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-300" />
            Real stories from real travelers
          </div>

          <h1
            className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Local Experiences{' '}
            <span style={{ color: '#a7f3d0' }}>& Reviews</span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-base text-white/70">
            Discover authentic travel stories shared by fellow explorers. Rate locations,
            share your own journey, and help others travel with confidence.
          </p>

          {isSignedIn && (
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold transition hover:bg-gray-50"
              style={{ color: '#085041' }}
            >
              <Plus className="h-4 w-4" /> Share Your Experience
            </button>
          )}
          {!isSignedIn && (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold transition hover:bg-gray-50"
              style={{ color: '#085041' }}
            >
              Sign in to share your experience
            </Link>
          )}
        </div>
      </section>

      {/* Filter & Content */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        {/* City filter */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <button
            onClick={() => setCityFilter('')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              !cityFilter
                ? 'text-white'
                : 'border border-gray-200 text-gray-600 hover:border-[#1D9E75] hover:text-[#1D9E75]'
            }`}
            style={!cityFilter ? { background: '#085041' } : {}}
          >
            All Cities
          </button>
          {(cityFilter && !uniqueCities.includes(cityFilter) ? [...uniqueCities, cityFilter] : uniqueCities).map(city => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                cityFilter === city
                  ? 'text-white'
                  : 'border border-gray-200 text-gray-600 hover:border-[#1D9E75] hover:text-[#1D9E75]'
              }`}
              style={cityFilter === city ? { background: '#085041' } : {}}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Experience list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#1D9E75]" />
          </div>
        ) : experiences.length === 0 ? (
          <div className="py-20 text-center">
            <MapPin className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700" style={{ fontFamily: "'Outfit', sans-serif" }}>
              No experiences yet
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              {cityFilter
                ? `No reviews for ${cityFilter} yet. Be the first!`
                : 'Be the first to share your travel story.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {experiences.map(exp => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                onLike={handleLike}
                onDelete={handleDelete}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Create modal */}
      {showCreate && (
        <CreateExperienceForm
          onCreated={() => { setShowCreate(false); fetchExperiences(); }}
          onClose={() => setShowCreate(false)}
        />
      )}
    </main>
  );
}
