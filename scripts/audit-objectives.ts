/**
 * Pixels Platform — Objective Audit Agent
 *
 * Scans the codebase to verify which spec objectives are implemented.
 * Run: npx tsx scripts/audit-objectives.ts
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const SRC = join(__dirname, '..', 'src');
const API = join(SRC, 'app', 'api');
const PAGES = join(SRC, 'app');

interface Check {
  module: string;
  objective: string;
  check: () => boolean;
  priority: 'MVP' | 'V1' | 'V2';
}

function fileExists(path: string): boolean {
  return existsSync(join(__dirname, '..', path));
}

function dirHasFiles(path: string): boolean {
  try {
    return readdirSync(join(__dirname, '..', path)).length > 0;
  } catch { return false; }
}

function fileContains(path: string, needle: string): boolean {
  try {
    return readFileSync(join(__dirname, '..', path), 'utf-8').includes(needle);
  } catch { return false; }
}

function apiRouteExists(route: string): boolean {
  const routePath = join('src/app/api', route, 'route.ts');
  return fileExists(routePath);
}

function pageExists(route: string): boolean {
  return fileExists(join('src/app', route, 'page.tsx'));
}

const checks: Check[] = [
  // ── MODULE 1: TALENT HUB ──
  { module: 'Talent Hub', objective: 'Auth (email + password)', check: () => apiRouteExists('auth/register') && apiRouteExists('auth/login'), priority: 'MVP' },
  { module: 'Talent Hub', objective: 'Auth Google Sign-In', check: () => fileContains('src/app/login/page.tsx', 'GoogleAuthProvider'), priority: 'MVP' },
  { module: 'Talent Hub', objective: 'Artist profile page', check: () => pageExists('profile'), priority: 'MVP' },
  { module: 'Talent Hub', objective: 'Artist profile API (CRUD)', check: () => apiRouteExists('artists/[id]'), priority: 'MVP' },
  { module: 'Talent Hub', objective: 'Artist instruments/genres/skills fields', check: () => fileContains('src/app/profile/page.tsx', 'instruments'), priority: 'MVP' },
  { module: 'Talent Hub', objective: 'Artist search/filter API', check: () => apiRouteExists('artists'), priority: 'V1' },
  { module: 'Talent Hub', objective: 'Availability calendar page', check: () => pageExists('availability'), priority: 'MVP' },
  { module: 'Talent Hub', objective: 'Badges & progression system', check: () => fileContains('src/app/profile/page.tsx', 'badge') || fileContains('src/app/profile/page.tsx', 'Badge'), priority: 'V2' },
  { module: 'Talent Hub', objective: 'Artist onboarding flow', check: () => pageExists('register'), priority: 'MVP' },

  // ── MODULE 2: MARKETPLACE & CONTRATS ──
  { module: 'Marketplace', objective: 'Event submission form', check: () => pageExists('events/new'), priority: 'MVP' },
  { module: 'Marketplace', objective: 'Event listing page', check: () => pageExists('events'), priority: 'MVP' },
  { module: 'Marketplace', objective: 'Events API (CRUD)', check: () => apiRouteExists('events'), priority: 'MVP' },
  { module: 'Marketplace', objective: 'Quote generation API', check: () => apiRouteExists('events/[id]/quote'), priority: 'MVP' },
  { module: 'Marketplace', objective: 'Quote accept flow', check: () => apiRouteExists('events/[id]/quote/accept'), priority: 'MVP' },
  { module: 'Marketplace', objective: 'Pipeline Kanban view', check: () => fileContains('src/app/events/page.tsx', 'status') || fileContains('src/app/events/page.tsx', 'kanban'), priority: 'V1' },
  { module: 'Marketplace', objective: 'Digital contract generation', check: () => apiRouteExists('events/[id]/contract'), priority: 'V1' },
  { module: 'Marketplace', objective: 'Electronic signature', check: () => apiRouteExists('contracts/[id]/sign'), priority: 'V2' },

  // ── MODULE 3: MISSION BUILDER ──
  { module: 'Mission Builder', objective: 'Mission CRUD API', check: () => apiRouteExists('missions') && apiRouteExists('missions/[id]'), priority: 'MVP' },
  { module: 'Mission Builder', objective: 'Mission slots (roster)', check: () => apiRouteExists('missions/[id]/slots'), priority: 'MVP' },
  { module: 'Mission Builder', objective: 'Mission completion flow', check: () => apiRouteExists('missions/[id]/complete'), priority: 'MVP' },
  { module: 'Mission Builder', objective: 'Missions listing page', check: () => pageExists('missions'), priority: 'MVP' },
  { module: 'Mission Builder', objective: 'Mission detail page', check: () => pageExists('missions/[id]'), priority: 'MVP' },
  { module: 'Mission Builder', objective: 'Auto roster suggestion', check: () => apiRouteExists('missions/[id]/suggest-roster'), priority: 'V1' },
  { module: 'Mission Builder', objective: 'Mission chat (per-mission)', check: () => apiRouteExists('missions/[id]/chat'), priority: 'V1' },

  // ── MODULE 4: STUDIO MUSICAL ──
  { module: 'Studio Musical', objective: 'Song library page', check: () => pageExists('studio'), priority: 'V1' },
  { module: 'Studio Musical', objective: 'Song detail page', check: () => pageExists('studio/[songId]'), priority: 'V1' },
  { module: 'Studio Musical', objective: 'Songs API (CRUD)', check: () => apiRouteExists('songs'), priority: 'V1' },
  { module: 'Studio Musical', objective: 'Chord charts API', check: () => apiRouteExists('songs/[id]/chord-charts'), priority: 'V1' },
  { module: 'Studio Musical', objective: 'Instrument parts generation', check: () => apiRouteExists('chord-charts/[id]/generate-parts'), priority: 'V1' },
  { module: 'Studio Musical', objective: 'Transposition engine', check: () => fileExists('src/lib/music/transposition.ts'), priority: 'V1' },
  { module: 'Studio Musical', objective: 'PDF generation (instrument parts)', check: () => apiRouteExists('instrument-parts/[id]/pdf'), priority: 'V1' },
  { module: 'Studio Musical', objective: 'Rehearsal notes', check: () => apiRouteExists('instrument-parts/[id]/rehearsal-notes') || apiRouteExists('rehearsal-notes/[id]'), priority: 'V1' },
  { module: 'Studio Musical', objective: 'Event song assignments', check: () => apiRouteExists('events/[id]/song-assignments'), priority: 'V1' },
  { module: 'Studio Musical', objective: 'Music types definitions', check: () => fileExists('src/lib/music/types.ts'), priority: 'V1' },

  // ── MODULE 5: LOGISTIQUE & EQUIPEMENT ──
  { module: 'Logistique', objective: 'Equipment inventory page', check: () => pageExists('equipment'), priority: 'V1' },
  { module: 'Logistique', objective: 'Equipment API (CRUD)', check: () => apiRouteExists('equipment'), priority: 'V1' },
  { module: 'Logistique', objective: 'Equipment loan system', check: () => apiRouteExists('equipment/[id]/loan'), priority: 'V1' },
  { module: 'Logistique', objective: 'Incident management page', check: () => pageExists('incidents'), priority: 'V1' },
  { module: 'Logistique', objective: 'Incident API', check: () => apiRouteExists('incidents'), priority: 'V1' },
  { module: 'Logistique', objective: 'Studio/venue directory', check: () => apiRouteExists('venues') && pageExists('venues'), priority: 'V2' },
  { module: 'Logistique', objective: 'Transport checklist system', check: () => apiRouteExists('transport-checklists'), priority: 'V2' },

  // ── MODULE 6: FINANCE & TRESORERIE ──
  { module: 'Finance', objective: 'Finance dashboard page', check: () => pageExists('finances'), priority: 'MVP' },
  { module: 'Finance', objective: 'Finance API', check: () => apiRouteExists('finances'), priority: 'MVP' },
  { module: 'Finance', objective: '60/20/20 auto split', check: () => fileContains('src/app/api/finances/route.ts', '0.6'), priority: 'MVP' },
  { module: 'Finance', objective: 'Stripe Connect integration', check: () => apiRouteExists('stripe'), priority: 'V2' },
  { module: 'Finance', objective: 'Invoice generation', check: () => apiRouteExists('invoices'), priority: 'V2' },

  // ── MODULE 7: COMMUNAUTE & JAM SESSIONS ──
  { module: 'Communaute', objective: 'Jam sessions page', check: () => pageExists('jam-sessions'), priority: 'V1' },
  { module: 'Communaute', objective: 'Jam sessions API', check: () => apiRouteExists('jam-sessions'), priority: 'V1' },
  { module: 'Communaute', objective: 'Join/leave jam sessions', check: () => apiRouteExists('jam-sessions/[id]'), priority: 'V1' },
  { module: 'Communaute', objective: 'Community feed', check: () => apiRouteExists('feed') && pageExists('feed'), priority: 'V2' },
  { module: 'Communaute', objective: 'Direct messaging', check: () => apiRouteExists('messages') && pageExists('messages'), priority: 'V2' },
  { module: 'Communaute', objective: 'Push notifications (PWA)', check: () => apiRouteExists('push-subscribe'), priority: 'V2' },

  // ── MODULE 8: ADMINISTRATION ──
  { module: 'Administration', objective: 'Admin dashboard', check: () => fileContains('src/app/dashboard/page.tsx', 'admin'), priority: 'MVP' },
  { module: 'Administration', objective: 'Role-based access (sidebar)', check: () => fileContains('src/components/layout/Sidebar.tsx', 'roles'), priority: 'MVP' },
  { module: 'Administration', objective: 'Multi-role auth (artist/organizer/admin/operator)', check: () => fileContains('src/app/api/auth/register/route.ts', 'role'), priority: 'MVP' },
  { module: 'Administration', objective: 'Wiki/documentation system', check: () => apiRouteExists('wiki') && pageExists('wiki'), priority: 'V2' },
  { module: 'Administration', objective: 'Musical director training program', check: () => apiRouteExists('training'), priority: 'V2' },
  { module: 'Administration', objective: 'Multi-city support', check: () => apiRouteExists('cities'), priority: 'V2' },

  // ── DESIGN & UX ──
  { module: 'Design', objective: 'Landing page (editorial design)', check: () => pageExists('') && fileContains('src/app/page.tsx', 'editorial-heading'), priority: 'MVP' },
  { module: 'Design', objective: 'Responsive layout', check: () => fileContains('src/app/page.tsx', 'md:'), priority: 'MVP' },
  { module: 'Design', objective: 'Brand colors (orange #FF8C45)', check: () => fileContains('src/app/globals.css', '#FF8C45'), priority: 'MVP' },
  { module: 'Design', objective: 'Pixels logo (cursive italic)', check: () => fileContains('src/app/globals.css', 'pixels-logo'), priority: 'MVP' },
  { module: 'Design', objective: 'Photo gallery from Drive', check: () => fileExists('public/images/event-1.jpg'), priority: 'MVP' },
  { module: 'Design', objective: 'SVG icons (not emoji)', check: () => fileContains('src/components/layout/Sidebar.tsx', 'viewBox'), priority: 'MVP' },
  { module: 'Design', objective: 'UI component library (Button/Card/Input/Badge/Modal/Select)', check: () => fileExists('src/components/ui/Button.tsx') && fileExists('src/components/ui/Card.tsx') && fileExists('src/components/ui/Modal.tsx'), priority: 'MVP' },

  // ── INFRA ──
  { module: 'Infrastructure', objective: 'Firebase Auth integration', check: () => fileExists('src/lib/firebase.ts') && fileExists('src/lib/firebase-admin.ts'), priority: 'MVP' },
  { module: 'Infrastructure', objective: 'Firestore database', check: () => fileContains('src/lib/firebase-admin.ts', 'getFirestore'), priority: 'MVP' },
  { module: 'Infrastructure', objective: 'AuthProvider context', check: () => fileExists('src/lib/auth-context.tsx'), priority: 'MVP' },
  { module: 'Infrastructure', objective: 'Server-side session (getSession)', check: () => fileExists('src/lib/auth.ts'), priority: 'MVP' },
  { module: 'Infrastructure', objective: 'Vercel deployment ready', check: () => fileContains('src/lib/firebase-admin.ts', 'Proxy'), priority: 'MVP' },
  { module: 'Infrastructure', objective: 'Domain pixels-montreal.com connected', check: () => false, priority: 'MVP' },
];

// Run audit
console.log('\n╔══════════════════════════════════════════════════════════════════╗');
console.log('║        PIXELS PLATFORM — OBJECTIVE AUDIT REPORT                ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

const results: { pass: Check[]; fail: Check[] } = { pass: [], fail: [] };

for (const c of checks) {
  const passed = c.check();
  (passed ? results.pass : results.fail).push(c);
}

const phases = ['MVP', 'V1', 'V2'] as const;
for (const phase of phases) {
  const phaseChecks = checks.filter(c => c.priority === phase);
  const passed = phaseChecks.filter(c => results.pass.includes(c));
  const failed = phaseChecks.filter(c => results.fail.includes(c));
  const pct = Math.round((passed.length / phaseChecks.length) * 100);

  console.log(`\n── ${phase} (${passed.length}/${phaseChecks.length} = ${pct}%) ${'█'.repeat(Math.round(pct / 5))}${'░'.repeat(20 - Math.round(pct / 5))}`);

  for (const c of passed) {
    console.log(`  ✓  [${c.module}] ${c.objective}`);
  }
  for (const c of failed) {
    console.log(`  ✗  [${c.module}] ${c.objective}`);
  }
}

const total = checks.length;
const totalPassed = results.pass.length;
const totalPct = Math.round((totalPassed / total) * 100);

console.log(`\n══════════════════════════════════════════════════════════════════`);
console.log(`TOTAL: ${totalPassed}/${total} objectives met (${totalPct}%)`);
console.log(`══════════════════════════════════════════════════════════════════`);

// Roadmap recommendation
const mvpFailed = results.fail.filter(c => c.priority === 'MVP');
const v1Failed = results.fail.filter(c => c.priority === 'V1');

if (mvpFailed.length > 0) {
  console.log(`\n⚡ PRIORITY: ${mvpFailed.length} MVP objectives still missing:`);
  for (const c of mvpFailed) {
    console.log(`   → [${c.module}] ${c.objective}`);
  }
}

if (v1Failed.length > 0) {
  console.log(`\n📋 NEXT: ${v1Failed.length} V1 objectives to implement:`);
  for (const c of v1Failed) {
    console.log(`   → [${c.module}] ${c.objective}`);
  }
}

const v2Failed = results.fail.filter(c => c.priority === 'V2');
if (v2Failed.length > 0) {
  console.log(`\n🔮 FUTURE: ${v2Failed.length} V2 objectives (planned):`);
  for (const c of v2Failed) {
    console.log(`   → [${c.module}] ${c.objective}`);
  }
}

console.log('');
