import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import ExerciseLibraryPage from './page';
vi.mock('@/hooks/use-api', () => ({
  useExercises: () => ({ data: { data: [
    { id: 'beginner', name: 'حرکت مبتدی واقعی', muscleGroup: 'سینه', difficulty: 'beginner' },
    { id: 'intermediate', name: 'حرکت متوسط واقعی', muscleGroup: 'پاها', difficulty: 'intermediate' },
  ] }, isLoading: false }),
  useDeleteExercise: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));
it('filters persisted English difficulty enums using Persian labels', async () => {
  render(<ExerciseLibraryPage />); const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'متوسط' }));
  expect(screen.getByText('حرکت متوسط واقعی')).toBeInTheDocument();
  expect(screen.queryByText('حرکت مبتدی واقعی')).not.toBeInTheDocument();
});
