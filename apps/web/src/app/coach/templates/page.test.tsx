import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import TemplatesPage from './page';

const m = vi.hoisted(() => ({ create: vi.fn(), add: vi.fn(), remove: vi.fn(), push: vi.fn(), success: vi.fn(), error: vi.fn() }));
const source = {
  id: 'blueprint', coachId: 'my-coach', athleteId: 'old-athlete', name: 'برنامه واقعی مربی', description: 'توضیح الگو',
  startDate: '2026-10-01T00:00:00Z', endDate: '2026-10-29T00:00:00Z', frequencyPerWeek: 3, status: 'active',
  exercises: [
    { id: 'row1', programId: 'blueprint', exerciseId: 'ex1', dayOfWeek: 2, order: 4, sets: 3, reps: '8-10', weight: 20, restSeconds: 90, notes: 'آهسته', isCompleted: true, completedAt: '2026-10-02', actualSets: 5, actualReps: '12', actualWeight: 40 },
    { id: 'row2', programId: 'blueprint', exerciseId: 'ex2', dayOfWeek: 4, order: 1, sets: 2, reps: '12', restSeconds: 60, isCompleted: false },
  ],
};
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: m.push }) }));
vi.mock('sonner', () => ({ toast: { success: m.success, error: m.error } }));
vi.mock('@/components/auth/AuthProvider', () => ({ useAuth: () => ({ user: { id: 'my-coach', role: 'coach' } }) }));
vi.mock('@/hooks/use-api', () => ({
  useTrainingPrograms: () => ({ data: { data: [source, { ...source, id: 'other', coachId: 'another-coach', name: 'برنامه مربی دیگر' }] }, isLoading: false }),
  useUsers: () => ({ data: { data: [{ id: 'new-athlete', firstName: 'نگار', lastName: 'جدید', role: 'athlete' }] }, isLoading: false }),
  useCreateTrainingProgram: () => ({ mutateAsync: m.create }),
  useAddProgramExercise: () => ({ mutateAsync: m.add }),
  useDeleteTrainingProgram: () => ({ mutateAsync: m.remove }),
}));
beforeEach(() => {
  vi.clearAllMocks();
  m.create.mockResolvedValue({ success: true, data: { id: 'fresh-program' } });
  m.add.mockResolvedValue({ success: true, data: {} });
  m.remove.mockResolvedValue({ success: true });
  Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.scrollIntoView = () => {};
});
async function clone() {
  const user = userEvent.setup();
  await user.click(screen.getAllByRole('button', { name: 'استفاده برای شاگرد' })[0]);
  await user.click(screen.getByRole('combobox', { name: /ورزشکار/ }));
  await user.click(await screen.findByRole('option', { name: 'نگار جدید' }));
  await user.click(screen.getByRole('button', { name: 'ساخت برنامه از الگو' }));
}
it('uses saved owned programs rather than imaginary templates', () => {
  render(<TemplatesPage />);
  expect(screen.getByText('برنامه واقعی مربی')).toBeInTheDocument();
  expect(screen.queryByText('برنامه مربی دیگر')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'مشاهده' })).toHaveAttribute('href', '/coach/programs/blueprint');
});
it('copies prescriptions and order without any completion or actual fields', async () => {
  render(<TemplatesPage />);
  await clone();
  await waitFor(() => expect(m.push).toHaveBeenCalledWith('/coach/programs/fresh-program'));
  expect(m.create).toHaveBeenCalledWith(expect.objectContaining({ name: source.name, description: source.description, athleteId: 'new-athlete', coachId: 'my-coach', frequencyPerWeek: 3, status: 'draft' }));
  expect(m.add.mock.calls.map(([arg]) => arg)).toEqual([
    { programId: 'fresh-program', data: { exerciseId: 'ex1', dayOfWeek: 2, order: 4, sets: 3, reps: '8-10', weight: 20, restSeconds: 90, notes: 'آهسته' } },
    { programId: 'fresh-program', data: { exerciseId: 'ex2', dayOfWeek: 4, order: 1, sets: 2, reps: '12', weight: undefined, restSeconds: 60, notes: undefined } },
  ]);
});
it('deletes only the newly created program if a prescription copy fails', async () => {
  m.add.mockResolvedValueOnce({ success: true }).mockRejectedValueOnce(new Error('exercise unavailable'));
  render(<TemplatesPage />);
  await clone();
  await waitFor(() => expect(m.remove).toHaveBeenCalledWith('fresh-program'));
  expect(m.success).not.toHaveBeenCalled();
  expect(m.push).not.toHaveBeenCalled();
  expect(m.error).toHaveBeenCalled();
});
it('shows the incomplete program for recovery when cleanup also fails', async () => {
  m.add.mockRejectedValue(new Error('exercise unavailable'));
  m.remove.mockRejectedValue(new Error('cleanup denied'));
  render(<TemplatesPage />);
  await clone();
  expect(await screen.findByRole('link', { name: /برنامه ناقص/ })).toHaveAttribute('href', '/coach/programs/fresh-program');
  expect(m.success).not.toHaveBeenCalled();
  expect(m.push).not.toHaveBeenCalled();
});
