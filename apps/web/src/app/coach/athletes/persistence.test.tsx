import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import AthletesPage from './page';
import AthleteDetailPage from './[id]/page';
import type { Goal } from '@/lib/types';

const m = vi.hoisted(() => ({ update: vi.fn(), error: vi.fn(), success: vi.fn() }));
const athlete = { id: 'athlete1', firstName: 'نگار', lastName: 'واقعی', email: 'n@example.test', phone: '09123456789', role: 'athlete', status: 'active', createdAt: '2026-01-01', lastLoginAt: '2025-01-01' };
const goal: Goal = { id: 'goal1', athleteId: 'athlete1', coachId: 'coach1', title: 'هدف واقعی', description: 'هدف قبلی', category: 'strength', targetValue: 100, currentValue: 20, progressPercentage: 20, unit: 'کیلوگرم', status: 'in_progress', startDate: '2026-11-01', targetDate: '2026-12-01', createdAt: '2026-11-01', updatedAt: 'v1' };
const program = { id: 'program1', athleteId: 'athlete1', coachId: 'coach1', name: 'برنامه زنده', status: 'active', exercises: [{ id: 'row1', programId: 'program1', exerciseId: 'ex1', exercise: { name: 'پرس سینه' }, dayOfWeek: 0, order: 0, sets: 3, reps: '8-10', restSeconds: 60, isCompleted: false }] };
vi.mock('next/navigation', () => ({ useParams: () => ({ id: 'athlete1' }) }));
vi.mock('sonner', () => ({ toast: { error: m.error, success: m.success } }));
vi.mock('@/components/auth/AuthProvider', () => ({ useAuth: () => ({ user: { id: 'coach1', role: 'coach' } }) }));
vi.mock('@/hooks/use-api', () => ({
  useUsers: () => ({ data: { data: [athlete, { ...athlete, id: 'new-athlete', firstName: 'آرش' }] }, isLoading: false }),
  useCoachDashboard: () => ({ data: { data: { athletes: [{ id: 'athlete1', currentProgram: program, progress: 67, lastCheckIn: '2026-11-05T12:00:00Z' }] } }, isLoading: false }),
  useUser: () => ({ data: { data: athlete }, isLoading: false }),
  useGoals: () => ({ data: { data: [goal, { ...goal, id: 'foreign-goal', coachId: 'other-coach', title: 'هدف مربی دیگر' }] }, isLoading: false }),
  useTrainingPrograms: () => ({ data: { data: [program] }, isLoading: false }),
  useCheckIns: () => ({ data: { data: [] }, isLoading: false }),
  useConversations: () => ({ data: { data: [] }, isLoading: false }),
  useCreateGoal: () => ({ mutateAsync: vi.fn() }),
  useDeleteGoal: () => ({ mutateAsync: vi.fn() }),
  useUpdateGoal: () => ({ mutateAsync: m.update, isPending: false }),
  useMemberships: () => ({ data: { data: [] }, isLoading: false }),
  usePayments: () => ({ data: { data: [] }, isLoading: false }),
}));
beforeEach(() => { vi.clearAllMocks(); m.update.mockResolvedValue({ success: true, data: goal }); });
it('shows roster program and progress from the coach dashboard and links program actions', () => {
  render(<AthletesPage />);
  const row = screen.getByRole('row', { name: /نگار واقعی/ });
  expect(within(row).getByText('برنامه زنده')).toBeInTheDocument();
  expect(within(row).getByText('۶۷٪')).toBeInTheDocument();
  expect(within(row).getByRole('link', { name: 'برنامه تمرینی' })).toHaveAttribute('href', '/coach/programs/program1');
  const newRow = screen.getByRole('row', { name: /آرش واقعی/ });
  expect(within(newRow).getByRole('link', { name: 'ساخت برنامه' })).toHaveAttribute('href', '/coach/programs/new?athleteId=new-athlete');
});
it('uses the actual last check-in instead of the account login date', () => {
  render(<AthletesPage />);
  const row = screen.getByRole('row', { name: /نگار واقعی/ });
  expect(within(row).getByText(/آبان/)).toBeInTheDocument();
  expect(within(row).queryByText(/دی/)).not.toBeInTheDocument();
});
it('shows prescription ranges intact on the athlete detail', () => {
  render(<AthleteDetailPage />);
  expect(screen.getByText(/8-10 تکرار/)).toBeInTheDocument();
});
it('edits owned goal values through the update API and keeps other coaches’ goals read-only', async () => {
  render(<AthleteDetailPage />); const user = userEvent.setup();
  await user.click(screen.getByRole('tab', { name: 'پیشرفت' }));
  expect(screen.queryByRole('button', { name: 'ویرایش هدف هدف مربی دیگر' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'حذف هدف هدف مربی دیگر' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'ویرایش هدف هدف واقعی' }));
  const value = screen.getByLabelText(/^مقدار فعلی/); await user.clear(value); await user.type(value, '35');
  await user.click(screen.getByRole('button', { name: 'ذخیره هدف' }));
  await waitFor(() => expect(m.update).toHaveBeenCalledWith({ id: 'goal1', data: expect.objectContaining({ currentValue: 35, targetValue: 100, status: 'in_progress' }) }));
  expect(m.success).toHaveBeenCalled();
});
it('keeps a rejected goal edit open and reports the failure', async () => {
  m.update.mockRejectedValue(new Error('save failed'));
  render(<AthleteDetailPage />); const user = userEvent.setup();
  await user.click(screen.getByRole('tab', { name: 'پیشرفت' }));
  await user.click(screen.getByRole('button', { name: 'ویرایش هدف هدف واقعی' }));
  await user.click(screen.getByRole('button', { name: 'ذخیره هدف' }));
  await waitFor(() => expect(m.error).toHaveBeenCalled());
  expect(screen.getByRole('dialog', { name: 'ویرایش هدف شاگرد' })).toBeInTheDocument();
  expect(m.success).not.toHaveBeenCalled();
});
