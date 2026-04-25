import { api } from '../lib/api';
import type { AuthUser } from '../context/AuthContext';

export interface ApiResp<T> { success: boolean; data: T }

export interface AuthResp { token: string; user: AuthUser }

export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  onboardingComplete: boolean;
  preferences: string[];
}

export interface OnboardingStatus {
  isComplete: boolean;
  preferences: string[];
}

export interface Gem {
  id: string; icon: string; name: string; meta: string;
  distance: string; bg: string; category: string;
}

export interface Alert {
  id: string; dot: string; bg: string; severity: string; text: string; time: string;
}

export interface TransitRoute {
  id: string; icon: string; name: string; sub: string; time: string; status: string; color: string;
}

export interface TransitData {
  routes: TransitRoute[];
  airportCosts: { label: string; value: string; tier: string }[];
}

export interface SafetyData {
  score: number; scamRisk: string; nightSafety: string;
  breakdown: { label: string; value: string; pct: number; color: string }[];
  tips: { icon: string; bold: string; rest: string }[];
  emergency: { hospital: { name: string; distance: string }; police: { distance: string }; embassy: { distance: string } };
  medicalCosts: { label: string; value: string; tier: string }[];
}

export interface SearchLog {
  id: string; destination: string; date: string | null;
  experience: string | null; guests: string | null; createdAt: string;
}

// ── Auth ─────────────────────────────────────────────────────────
export const authRegister = (email: string, password: string, firstName?: string, lastName?: string) =>
  api.post<ApiResp<AuthResp>>('/auth/register', { email, password, firstName, lastName });

export const authLogin = (email: string, password: string) =>
  api.post<ApiResp<AuthResp>>('/auth/login', { email, password });

// ── User ─────────────────────────────────────────────────────────
export const getMe = (token: string) =>
  api.get<ApiResp<UserProfile>>('/users/me', token);

// ── Onboarding ───────────────────────────────────────────────────
export const getOnboarding = (token: string) =>
  api.get<ApiResp<OnboardingStatus>>('/onboarding', token);

export const saveOnboarding = (token: string, preferences: string[]) =>
  api.post<ApiResp<OnboardingStatus>>('/onboarding', { preferences }, token);

// ── Search & Discovery ───────────────────────────────────────────
export const createSearch = (token: string, body: { destination: string; date?: string; experience?: string; guests?: string }) =>
  api.post<ApiResp<{ searchId: string }>>('/search', body, token);

export const getSearchHistory = (token: string) =>
  api.get<ApiResp<SearchLog[]>>('/search/history', token);

export const getGems = (token: string) =>
  api.get<ApiResp<Gem[]>>('/search/services/gems', token);

export const getAlerts = (token: string) =>
  api.get<ApiResp<Alert[]>>('/search/services/alerts', token);

export const getTransit = (token: string) =>
  api.get<ApiResp<TransitData>>('/search/transit', token);

export const getSafety = (token: string) =>
  api.get<ApiResp<SafetyData>>('/search/safety', token);
