import '@testing-library/jest-dom'
import Home from '@/app/page';
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import RegisterPage from '@/app/register-user/page';


async function resolvedComponent(Component: any, props: any) {
    const ComponentResolved = props ? await Component(props) : await Component()
    return () => ComponentResolved
}

describe('Home', () => {
    it('renders recipes correctly', async () => {

        const HomeResolved = await resolvedComponent(Home, null)
        render(<HomeResolved />)

        // Wait for the asynchronous data fetching to complete
        await waitFor(() => {
            expect(screen.getByTestId('recipe-card')).toBeInTheDocument();
        })
    })
})

jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: jest.fn(),
    }),
  }));

test('Form validation works correctly', async () => {
  const { getByTestId, getByText, queryByText } = render(<RegisterPage />);

  // Fill in the form with invalid data
  fireEvent.change(getByTestId('name'), { target: { value: '' } });
  fireEvent.change(getByTestId('email'), { target: { value: 'invalid-email' } });
  fireEvent.change(getByTestId('password'), { target: { value: 'short' } });
  fireEvent.change(getByTestId('confirmPassword'), { target: { value: 'passwordMismatch' } });

  // Submit the form
//   fireEvent.click(getByText('Register'));

  // Wait for async validation to complete
  await waitFor(() => {
    // Assert that error messages are displayed
    expect(getByText('required')).toBeInTheDocument();
    expect(getByText('email must be a valid email')).toBeInTheDocument();
    expect(getByText('password must be at least 8 characters')).toBeInTheDocument();
    expect(getByText('Does not match with password!')).toBeInTheDocument();
  });

  // Reset the form
  fireEvent.change(getByTestId('name'), { target: { value: 'ValidName' } });
  fireEvent.change(getByTestId('email'), { target: { value: 'valid@email.com' } });
  fireEvent.change(getByTestId('password'), { target: { value: 'ValidPassword' } });
  fireEvent.change(getByTestId('confirmPassword'), { target: { value: 'ValidPassword' } });

  // Submit the form again
//   fireEvent.click(getByText('Register'));

  // Wait for async validation to complete
  await waitFor(() => {
    // Assert that there are no error messages
    expect(queryByText('required')).toBeNull();
    expect(queryByText('email must be a valid email')).toBeNull();
    expect(queryByText('password must be at least 8 characters')).toBeNull();
    expect(queryByText('Does not match with password!')).toBeNull();
  });
});
