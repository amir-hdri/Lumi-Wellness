import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NewMemberPage from './admin/members/new/page';
import NewCoachPage from './admin/coaches/new/page';
import NewExercisePage from './coach/exercises/new/page';
import EditExercisePage from './coach/exercises/[id]/page';
import NewProgramPage from './coach/programs/new/page';
import NewAthletePage from './coach/athletes/new/page';
import ExerciseLibraryPage from './coach/exercises/page';
import { NewUserForm } from './admin/_components/NewUserForm';

const m = vi.hoisted(() => ({
  createUser: vi.fn(), setPassword: vi.fn(), createExercise: vi.fn(), updateExercise: vi.fn(),
  search: "", deleteExercise: vi.fn(), createProgram: vi.fn(), push: vi.fn(), success: vi.fn(), error: vi.fn(),
  user: { id: 'coach-real', role: 'coach', firstName: 'مربی', lastName: 'واقعی' },
  exercise: { id: 'exercise-real', name: 'پرس سینه', category: 'قدرتی', muscleGroup: 'سینه',
    equipment: 'دمبل', difficulty: 'intermediate', description: 'راهنمای قبلی', isActive: true },
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: m.push }), useParams: () => ({ id: 'exercise-real' }), useSearchParams: () => new URLSearchParams(m.search) }));
vi.mock('sonner', () => ({ toast: { success: m.success, error: m.error } }));
vi.mock('@/components/auth/AuthProvider', () => ({ useAuth: () => ({ user: m.user }) }));
vi.mock('@/hooks/use-api', () => ({
  USE_MOCK: false,
  useCreateUser: () => ({ mutateAsync: m.createUser, isPending: false }),
  useSetUserPassword: () => ({ mutateAsync: m.setPassword, isPending: false }),
  useBranches: () => ({ data: { data: [{ id: 'branch-id', name: 'LUMI' }] }, isLoading: false }),
  useMembershipPlans: () => ({ data: { data: [] } }),
  useUsers: () => ({ data: { data: [{ id: 'athlete-id', firstName: 'نگار', lastName: 'واقعی', role: 'athlete' }] }, isLoading: false }),
  useExercises: () => ({ data: { data: [m.exercise] }, isLoading: false }),
  useExercise: () => ({ data: { data: m.exercise }, isLoading: false }),
  useCreateExercise: () => ({ mutateAsync: m.createExercise, isPending: false }),
  useUpdateExercise: () => ({ mutateAsync: m.updateExercise, isPending: false }),
  useDeleteExercise: () => ({ mutateAsync: m.deleteExercise, isPending: false }),
  useCreateTrainingProgram: () => ({ mutateAsync: m.createProgram, isPending: false }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  m.user.role = "coach";
  m.search = "";
  m.deleteExercise.mockResolvedValue({ success: true });
  m.createUser.mockResolvedValue({ success: true, data: { id: 'new-user' } });
  m.setPassword.mockResolvedValue({ success: true });
  m.createExercise.mockResolvedValue({ success: true, data: { ...m.exercise, id: 'new-exercise' } });
  m.updateExercise.mockResolvedValue({ success: true, data: m.exercise });
  m.createProgram.mockResolvedValue({ success: true, data: { id: 'new-program' } });
  Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.scrollIntoView = () => {};
});

async function fillAccount() {
  const user = userEvent.setup();
  await user.type(screen.getByRole('textbox', { name: /^نام\s*\*?$/ }), 'نگار');
  await user.type(screen.getByRole('textbox', { name: /^نام خانوادگی/ }), 'واقعی');
  await user.type(screen.getByRole('textbox', { name: /^ایمیل/ }), 'new@example.test');
  await user.type(screen.getByRole('textbox', { name: /^شماره موبایل/ }), '09123456789');
  await user.type(screen.getByLabelText(/^رمز عبور/), 'Secure123');
  return user;
}
async function choose(index: number, label: string) {
  const user = userEvent.setup();
  await user.click(screen.getAllByRole('combobox')[index]);
  await user.click(await screen.findByRole('option', { name: label }));
}
async function fillProgram() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('عنوان برنامه'), 'برنامه واقعی');
  await choose(0, 'نگار واقعی');
  fireEvent.change(screen.getByLabelText('تاریخ شروع'), { target: { value: '2026-11-05' } });
  fireEvent.change(screen.getByLabelText('تاریخ پایان'), { target: { value: '2026-12-05' } });
  await choose(1, '۳ روز در هفته');
  return user;
}

describe('persistent account creation', () => {
  it('includes the first password in the account creation request atomically', async () => {
    render(<NewUserForm role="athlete" listHref="/admin/members" submitLabel="ثبت عضو" noun="عضو" />);
    const user = await fillAccount();
    await user.click(screen.getByRole('button', { name: 'ثبت عضو' }));
    await waitFor(() => expect(m.createUser).toHaveBeenCalledWith({ firstName: 'نگار', lastName: 'واقعی', email: 'new@example.test', phone: '09123456789', password: 'Secure123', role: 'athlete', branchId: undefined }));
    expect(m.setPassword).not.toHaveBeenCalled();
    expect(m.push).toHaveBeenCalledWith('/admin/members/new-user');
  });
  it.each([[NewMemberPage, 'athlete'], [NewCoachPage, 'coach']] as const)('saves the account without requiring unsupported extra fields', async (Page, role) => {
    m.user.role = 'admin';
    render(<Page />);
    const user = await fillAccount();
    await user.click(screen.getByRole('button', { name: /ثبت (عضو|مربی)/ }));
    await waitFor(() => expect(m.createUser).toHaveBeenCalledWith(expect.objectContaining({ role, password: 'Secure123' })));
  });
  it('does not offer staff account creation to reception', () => {
    m.user.role = 'receptionist';
    render(<NewCoachPage />);
    expect(screen.getByText('ساخت حساب مربی به دسترسی مدیریت نیاز دارد.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ثبت مربی' })).not.toBeInTheDocument();
  });
  it('keeps failed creation editable without announcing success or navigating', async () => {
    m.createUser.mockRejectedValue(new Error('duplicate email'));
    render(<NewUserForm role="coach" listHref="/admin/coaches" submitLabel="ثبت مربی" noun="مربی" />);
    const user = await fillAccount();
    await user.click(screen.getByRole('button', { name: 'ثبت مربی' }));
    await waitFor(() => expect(m.error).toHaveBeenCalled());
    expect(m.push).not.toHaveBeenCalled();
    expect(m.success).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: /^ایمیل/ })).toHaveValue('new@example.test');
  });
});

describe('persistent exercise forms', () => {
  it('sends muscleGroup, category and the backend difficulty enum on create', async () => {
    render(<NewExercisePage />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^نام حرکت/), 'پرس جدید');
    // The server stores free-text category/muscle names rather than display-only option labels.
    await user.type(screen.getByLabelText(/^دسته‌بندی/), 'قدرتی');
    await user.type(screen.getByLabelText(/^گروه عضلانی/), 'سینه');
    await user.click(screen.getByRole('button', { name: /ذخیره حرکت/ }));
    await waitFor(() => expect(m.createExercise).toHaveBeenCalledWith(expect.objectContaining({ name: 'پرس جدید', category: 'قدرتی', muscleGroup: 'سینه', difficulty: 'beginner' })));
    expect(m.push).toHaveBeenCalledWith('/coach/exercises');
  });
  it('persists edits to the requested exercise and remains on failure', async () => {
    m.updateExercise.mockRejectedValue(new Error('update rejected'));
    render(<EditExercisePage />);
    const user = userEvent.setup();
    const name = screen.getByLabelText(/^نام حرکت/);
    await user.clear(name); await user.type(name, 'پرس ویرایش‌شده');
    await user.click(screen.getByRole('button', { name: /^ذخیره/ }));
    await waitFor(() => expect(m.updateExercise).toHaveBeenCalledWith({ id: 'exercise-real', data: expect.objectContaining({ name: 'پرس ویرایش‌شده', category: 'قدرتی', muscleGroup: 'سینه', difficulty: 'intermediate' }) }));
    expect(m.push).not.toHaveBeenCalled();
    expect(m.success).not.toHaveBeenCalled();
  });
});

describe('persistent training program creation', () => {
  it('submits the athlete id, authenticated coach and numeric frequency', async () => {
    render(<NewProgramPage />);
    const user = await fillProgram();
    await user.click(screen.getByRole('button', { name: 'ذخیره برنامه' }));
    await waitFor(() => expect(m.createProgram).toHaveBeenCalledWith(expect.objectContaining({ name: 'برنامه واقعی', athleteId: 'athlete-id', coachId: 'coach-real', frequencyPerWeek: 3, status: 'draft' })));
    expect(m.push).toHaveBeenCalledWith('/coach/programs/new-program');
  });
  it('rejects inverted dates before sending a program', async () => {
    render(<NewProgramPage />);
    const user = await fillProgram();
    fireEvent.change(screen.getByLabelText('تاریخ پایان'), { target: { value: '2026-10-05' } });
    await user.click(screen.getByRole('button', { name: 'ذخیره برنامه' }));
    expect(m.createProgram).not.toHaveBeenCalled();
    expect(m.push).not.toHaveBeenCalled();
    expect(m.error).toHaveBeenCalled();
  });
  it('does not navigate when the server rejects saving', async () => {
    m.createProgram.mockRejectedValue(new Error('forbidden athlete'));
    render(<NewProgramPage />);
    const user = await fillProgram();
    await user.click(screen.getByRole('button', { name: 'ذخیره برنامه' }));
    await waitFor(() => expect(m.error).toHaveBeenCalled());
    expect(m.push).not.toHaveBeenCalled();
    expect(m.success).not.toHaveBeenCalled();
  });
});


describe('coach account creation authorization', () => {
  it('tells coaches that account creation requires reception or admin', () => {
    render(<NewAthletePage />);
    expect(screen.getByText(/پذیرش یا مدیر/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/^رمز عبور/)).not.toBeInTheDocument();
    expect(m.createUser).not.toHaveBeenCalled();
  });
  it('includes the entered password for an authorized caller', async () => {
    m.user.role = 'admin';
    render(<NewAthletePage />);
    const user = await fillAccount();
    await user.click(screen.getByRole('button', { name: 'ثبت شاگرد' }));
    await waitFor(() => expect(m.createUser).toHaveBeenCalledWith(expect.objectContaining({ password: 'Secure123', branchId: 'branch-id', role: 'athlete' })));
  });
});

describe('exercise library actions', () => {
  it('links editing to the saved exercise and confirms deletion before mutation', async () => {
    render(<ExerciseLibraryPage />);
    expect(screen.getByRole('link', { name: 'ویرایش' })).toHaveAttribute('href', '/coach/exercises/exercise-real');
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'حذف' }));
    expect(m.deleteExercise).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'حذف حرکت' }));
    await waitFor(() => expect(m.deleteExercise).toHaveBeenCalledWith('exercise-real'));
  });
  it('explains a referenced exercise conflict without claiming deletion', async () => {
    m.deleteExercise.mockRejectedValue({ response: { status: 409 } });
    render(<ExerciseLibraryPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'حذف' }));
    await user.click(screen.getByRole('button', { name: 'حذف حرکت' }));
    await waitFor(() => expect(m.error).toHaveBeenCalledWith(expect.stringMatching(/برنامه/)));
    expect(m.success).not.toHaveBeenCalled();
    expect(screen.getByText('پرس سینه')).toBeInTheDocument();
  });
});


it('preselects a valid athlete passed from the roster program action', () => {
  m.search = 'athleteId=athlete-id';
  render(<NewProgramPage />);
  expect(screen.getByRole('combobox', { name: 'ورزشکار' })).toHaveTextContent('نگار واقعی');
});
