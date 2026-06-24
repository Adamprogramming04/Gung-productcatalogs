import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GungUser {
  username: string;
  name: string;
  role: string;
}

const DEMO_USERS: Record<string, { password: string; user: GungUser }> = {
  admin: { password: 'gung123', user: { username: 'admin', name: 'Adam Andersson', role: 'Administrator' } },
  demo:  { password: 'demo123', user: { username: 'demo',  name: 'Demo User', role: 'Viewer' } }
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'gung_auth_user';
  private userSubject = new BehaviorSubject<GungUser | null>(this.readStoredUser());
  user$ = this.userSubject.asObservable();

  private readStoredUser(): GungUser | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  get currentUser(): GungUser | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }

  login(username: string, password: string): { success: boolean; error?: string } {
    const entry = DEMO_USERS[username.trim().toLowerCase()];
    if (!entry || entry.password !== password) {
      return { success: false, error: 'Invalid username or password' };
    }
    localStorage.setItem(this.storageKey, JSON.stringify(entry.user));
    this.userSubject.next(entry.user);
    return { success: true };
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.userSubject.next(null);
  }
}
