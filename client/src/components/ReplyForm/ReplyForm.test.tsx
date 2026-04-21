import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach } from 'vitest'
import { describe, expect, it, vi } from 'vitest'

import { ReplyForm } from './index'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('ReplyForm', () => {
  it('submits root operand when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(<ReplyForm mode="root" submitLabel="Create root" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Operand'), '42')
    await user.click(screen.getByRole('button', { name: 'Create root' }))

    expect(onSubmit).toHaveBeenCalledWith({ operand: 42 })
  })

  it('submits reply operation and operand when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(<ReplyForm mode="reply" submitLabel="Reply" onSubmit={onSubmit} />)

    await user.selectOptions(screen.getByLabelText('Operation'), 'mul')
    await user.type(screen.getByLabelText('Operand'), '2')
    await user.click(screen.getByRole('button', { name: 'Reply' }))

    expect(onSubmit).toHaveBeenCalledWith({ operation: 'mul', operand: 2 })
  })

  it('shows divide by zero validation error for reply mode', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(<ReplyForm mode="reply" submitLabel="Reply" onSubmit={onSubmit} />)

    await user.selectOptions(screen.getByLabelText('Operation'), 'div')
    await user.type(screen.getByLabelText('Operand'), '0')
    await user.click(screen.getByRole('button', { name: 'Reply' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot divide by zero')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows range validation error', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(<ReplyForm mode="root" submitLabel="Create root" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Operand'), '1000000000000')
    await user.click(screen.getByRole('button', { name: 'Create root' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Operand must be between')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('disables submit while submitting', async () => {
    render(<ReplyForm mode="root" submitLabel="Create root" onSubmit={vi.fn()} isSubmitting />)

    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled()
  })
})
