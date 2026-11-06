import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProgramDetailPage from './page';
import type { TrainingProgram } from '@/lib/types';

const m = vi.hoisted(() => ({ program: {} as TrainingProgram, userId: 'coach1', add: vi.fn(), updateEntry: vi.fn(), removeEntry: vi.fn(), update: vi.fn(), remove: vi.fn(), refetch: vi.fn(), push: vi.fn(), success: vi.fn(), error: vi.fn() }));
const library = [{ id: 'ex1', name: 'پرس سینه', category: 'قدرتی', muscleGroup: 'سینه', difficulty: 'intermediate', isActive: true, createdAt: '', updatedAt: '' }];
const entries = [{ id: 'row1', programId: 'program1', exerciseId: 'ex1', exercise: library[0], dayOfWeek: 0, order: 0, sets: 3, reps: '8-10', weight: 20, restSeconds: 60, isCompleted: true }];
vi.mock('next/navigation', () => ({ useParams: () => ({ id: 'program1' }), useRouter: () => ({ push: m.push }) }));
vi.mock('sonner', () => ({ toast: { success: m.success, error: m.error } }));
vi.mock('@/components/auth/AuthProvider', () => ({ useAuth: () => ({ user: { id: m.userId, role: 'coach' } }) }));
vi.mock('@/hooks/use-api', () => ({
  useTrainingProgram: () => ({ data: { data: m.program }, isLoading: false, refetch: m.refetch }),
  useExercises: () => ({ data: { data: library }, isLoading: false }),
  useAddProgramExercise: () => ({ mutateAsync: m.add }),
  useUpdateProgramExercise: () => ({ mutateAsync: m.updateEntry }),
  useDeleteProgramExercise: () => ({ mutateAsync: m.removeEntry }),
  useUpdateTrainingProgram: () => ({ mutateAsync: m.update }),
  useDeleteTrainingProgram: () => ({ mutateAsync: m.remove }),
}));
beforeEach(() => {
  vi.clearAllMocks(); m.userId = 'coach1';
  m.program = { id: 'program1', athleteId: 'athlete1', coachId: 'coach1', name: 'برنامه واقعی', startDate: '2026-11-01T00:00:00Z', endDate: '2026-12-01T00:00:00Z', frequencyPerWeek: 3, status: 'draft', exercises: [], createdAt: '', updatedAt: 'v1' };
  m.add.mockResolvedValue({ success: true, data: { ...entries[0], id: 'new-row' } });
  m.updateEntry.mockResolvedValue({ success: true }); m.removeEntry.mockResolvedValue({ success: true });
  m.update.mockResolvedValue({ success: true }); m.remove.mockResolvedValue({ success: true });
  m.refetch.mockResolvedValue({ data: { data: m.program } });
  Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });
  Element.prototype.hasPointerCapture = () => false; Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {}; Element.prototype.scrollIntoView = () => {};
});
async function choose(name: RegExp, label: string) {
  const user = userEvent.setup(); await user.click(screen.getByRole('combobox', { name }));
  await user.click(await screen.findByRole('option', { name: label }));
}
it('offers all seven days on an empty draft and saves a selected prescription by id', async () => {
  render(<ProgramDetailPage />);
  expect(screen.getAllByRole('tab')).toHaveLength(7);
  const user = userEvent.setup(); await user.click(screen.getByRole('tab', { name: 'دوشنبه' }));
  await user.click(screen.getByRole('button', { name: 'افزودن حرکت' }));
  await choose(/^حرکت/, 'پرس سینه — سینه');
  const reps = screen.getByLabelText(/^تکرار/); await user.clear(reps); await user.type(reps, '8-10');
  await user.click(screen.getByRole('button', { name: 'افزودن حرکت' }));
  await waitFor(() => expect(m.add).toHaveBeenCalledWith({ programId: 'program1', data: { exerciseId: 'ex1', dayOfWeek: 2, order: 0, sets: 3, reps: '8-10', weight: undefined, restSeconds: 60, notes: undefined } }));
});
it('preserves string reps and edits only writable prescription fields', async () => {
  m.program.exercises = entries as TrainingProgram['exercises']; render(<ProgramDetailPage />);
  expect(screen.getByText(/8-10 تکرار/)).toBeInTheDocument();
  const user = userEvent.setup(); await user.click(screen.getByRole('button', { name: 'ویرایش پرس سینه' }));
  expect(screen.getByRole('combobox', { name: /^حرکت/ })).toBeDisabled();
  await choose(/^روز تمرین/, 'جمعه');
  const reps = screen.getByLabelText(/^تکرار/); await user.clear(reps); await user.type(reps, '12-15');
  await user.click(screen.getByRole('button', { name: 'ذخیره حرکت' }));
  await waitFor(() => expect(m.updateEntry).toHaveBeenCalledWith({ programId: 'program1', exerciseId: 'row1', data: { dayOfWeek: 6, order: 0, sets: 3, reps: '12-15', weight: 20, restSeconds: 60, notes: '' } }));
});
it('confirms and persists removal from this program without deleting the library exercise', async () => {
  m.program.exercises = entries as TrainingProgram['exercises']; render(<ProgramDetailPage />);
  const user = userEvent.setup(); await user.click(screen.getByRole('button', { name: 'حذف پرس سینه از برنامه' }));
  expect(m.removeEntry).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'حذف حرکت از برنامه' }));
  await waitFor(() => expect(m.removeEntry).toHaveBeenCalledWith({ programId: 'program1', exerciseId: 'row1' }));
  expect(m.remove).not.toHaveBeenCalled();
});
describe('reordering', () => {
  function seed() { m.program.exercises = [...entries, { ...entries[0], id: 'row2', exerciseId: 'ex2', exercise: { ...library[0], id: 'ex2', name: 'اسکوات' }, order: 1, isCompleted: false }] as TrainingProgram['exercises']; }
  it('writes each affected row order without athlete completion fields', async () => {
    seed(); render(<ProgramDetailPage />); const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'انتقال اسکوات به یک رده بالاتر' }));
    await waitFor(() => expect(m.updateEntry).toHaveBeenCalledTimes(2));
    expect(m.updateEntry.mock.calls.map(([arg]) => arg)).toEqual([
      { programId: 'program1', exerciseId: 'row2', data: { order: 0 } },
      { programId: 'program1', exerciseId: 'row1', data: { order: 1 } },
    ]);
  });
  it('refetches and reports partial writes when one order update fails', async () => {
    seed(); m.updateEntry.mockResolvedValueOnce({ success: true }).mockRejectedValueOnce(new Error('write failed'));
    render(<ProgramDetailPage />); const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'انتقال اسکوات به یک رده بالاتر' }));
    await waitFor(() => expect(m.refetch).toHaveBeenCalled());
    expect(m.success).not.toHaveBeenCalled();
    expect(await screen.findByRole('alert')).toHaveTextContent(/بخشی/);
  });
});
it('activates and archives through the program update endpoint', async () => {
  m.program.exercises = entries as TrainingProgram['exercises']; render(<ProgramDetailPage />);
  const user = userEvent.setup(); await user.click(screen.getByRole('button', { name: 'فعال‌سازی' }));
  await waitFor(() => expect(m.update).toHaveBeenCalledWith({ id: 'program1', data: { status: 'active' } }));
  await user.click(screen.getByRole('button', { name: 'بایگانی' }));
  await user.click(screen.getByRole('button', { name: 'بایگانی برنامه' }));
  await waitFor(() => expect(m.update).toHaveBeenCalledWith({ id: 'program1', data: { status: 'archived' } }));
});
it('saves the edited program title without replacing its exercises', async () => {
  render(<ProgramDetailPage />); const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'ویرایش مشخصات' }));
  const title = screen.getByLabelText(/^عنوان برنامه/); await user.clear(title); await user.type(title, 'عنوان جدید');
  await user.click(screen.getByRole('button', { name: 'ذخیره مشخصات' }));
  await waitFor(() => expect(m.update).toHaveBeenCalledWith({ id: 'program1', data: expect.objectContaining({ name: 'عنوان جدید', frequencyPerWeek: 3, status: 'draft' }) }));
  expect(m.update.mock.calls[0][0].data).not.toHaveProperty('exercises');
});
it('does not expose mutation controls for another coach’s program', () => {
  m.userId = 'other-coach'; m.program.exercises = entries as TrainingProgram['exercises']; render(<ProgramDetailPage />);
  expect(screen.queryByRole('button', { name: 'فعال‌سازی' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'افزودن حرکت' })).not.toBeInTheDocument();
});
