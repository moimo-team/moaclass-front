import type { ReactElement } from 'react';

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export const renderLessonListPage = (ui: ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);
