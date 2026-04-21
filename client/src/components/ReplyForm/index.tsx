import type { FormEvent, JSX } from 'react'
import { useMemo, useState } from 'react'

import type { NodeOperation } from '../../types/node.types'
import type { ReplyFormProps } from './ReplyForm.types'

const MIN_OPERAND = -1000000
const MAX_OPERAND = 1000000

function isReplyOperation(value: string): value is Exclude<NodeOperation, 'none'> {
  return value === 'add' || value === 'sub' || value === 'mul' || value === 'div'
}

function parseOperand(rawValue: string): number | null {
  const trimmed = rawValue.trim()
  if (trimmed.length === 0) {
    return null
  }

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

export function ReplyForm(props: ReplyFormProps): JSX.Element {
  const [operand, setOperand] = useState<string>('')
  const [operation, setOperation] = useState<Exclude<NodeOperation, 'none'>>('add')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const operandHint = useMemo(
    () => `Operand must be between ${MIN_OPERAND} and ${MAX_OPERAND}`,
    [],
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setErrorMessage('')

    const parsedOperand = parseOperand(operand)
    if (parsedOperand === null) {
      setErrorMessage('Operand is required and must be a valid number')
      return
    }

    if (parsedOperand < MIN_OPERAND || parsedOperand > MAX_OPERAND) {
      setErrorMessage(operandHint)
      return
    }

    if (props.mode === 'reply') {
      if (!isReplyOperation(operation)) {
        setErrorMessage('Operation is required')
        return
      }

      if (operation === 'div' && parsedOperand === 0) {
        setErrorMessage('Cannot divide by zero')
        return
      }

      await props.onSubmit({ operation, operand: parsedOperand })
      return
    }

    await props.onSubmit({ operand: parsedOperand })
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-2 rounded border p-3">
      {props.mode === 'reply' ? (
        <label className="block">
          <span className="mb-1 block text-sm">Operation</span>
          <select
            aria-label="Operation"
            value={operation}
            onChange={(event) => setOperation(event.target.value as Exclude<NodeOperation, 'none'>)}
            className="w-full rounded border border-slate-300 px-2 py-1"
          >
            <option value="add">Add (+)</option>
            <option value="sub">Subtract (-)</option>
            <option value="mul">Multiply (x)</option>
            <option value="div">Divide (/)</option>
          </select>
        </label>
      ) : null}

      <label className="block">
        <span className="mb-1 block text-sm">Operand</span>
        <input
          aria-label="Operand"
          type="text"
          value={operand}
          onChange={(event) => setOperand(event.target.value)}
          className="w-full rounded border border-slate-300 px-2 py-1"
          placeholder="e.g. 42"
        />
      </label>

      {errorMessage ? (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={props.isSubmitting}
        className="rounded bg-slate-900 px-3 py-1 text-sm text-white disabled:opacity-60"
      >
        {props.isSubmitting ? 'Submitting...' : props.submitLabel}
      </button>
    </form>
  )
}
