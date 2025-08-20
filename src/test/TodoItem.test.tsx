import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TodoItem, Task } from '../ClunkyTodoList'

// Create MUI theme for tests
const theme = createTheme()

// Helper function to render TodoItem with theme
const renderTodoItem = (task: Task, onToggle = vi.fn(), onRemove = vi.fn()) => {
    return render(
        <ThemeProvider theme={theme}>
            <TodoItem task={task} onToggle={onToggle} onRemove={onRemove} />
        </ThemeProvider>
    )
}

describe('TodoItem Component', () => {
    const mockOnToggle = vi.fn()
    const mockOnRemove = vi.fn()

    beforeEach(() => {
        mockOnToggle.mockClear()
        mockOnRemove.mockClear()
    })

    describe('Rendering', () => {
        it('renders task text correctly', () => {
            const task: Task = { id: 1, text: 'Test task', completed: false }

            renderTodoItem(task, mockOnToggle, mockOnRemove)

            expect(screen.getByText('Test task')).toBeInTheDocument()
        })

        it('renders checkbox unchecked for incomplete task', () => {
            const task: Task = { id: 1, text: 'Test task', completed: false }

            renderTodoItem(task, mockOnToggle, mockOnRemove)

            const checkbox = screen.getByRole('checkbox')
            expect(checkbox).not.toBeChecked()
        })

        it('renders checkbox checked for completed task', () => {
            const task: Task = { id: 1, text: 'Test task', completed: true }

            renderTodoItem(task, mockOnToggle, mockOnRemove)

            const checkbox = screen.getByRole('checkbox')
            expect(checkbox).toBeChecked()
        })

        it('renders delete button', () => {
            const task: Task = { id: 1, text: 'Test task', completed: false }

            renderTodoItem(task, mockOnToggle, mockOnRemove)

            const deleteButton = screen.getByRole('button', { name: /delete/i })
            expect(deleteButton).toBeInTheDocument()
        })

        it('renders with proper task completion state', () => {
            const completedTask: Task = { id: 1, text: 'Completed task', completed: true }
            const incompleteTask: Task = { id: 2, text: 'Incomplete task', completed: false }

            // Test completed task renders correctly
            const { unmount } = renderTodoItem(completedTask, mockOnToggle, mockOnRemove)
            expect(screen.getByText('Completed task')).toBeInTheDocument()
            expect(screen.getByRole('checkbox')).toBeChecked()

            unmount()

            // Test incomplete task renders correctly  
            renderTodoItem(incompleteTask, mockOnToggle, mockOnRemove)
            expect(screen.getByText('Incomplete task')).toBeInTheDocument()
            expect(screen.getByRole('checkbox')).not.toBeChecked()
        })

        it('shows visual indication for completed tasks', () => {
            const task: Task = { id: 1, text: 'Completed task', completed: true }

            renderTodoItem(task, mockOnToggle, mockOnRemove)

            // The task text should be present and the component should render correctly
            const taskText = screen.getByText('Completed task')
            expect(taskText).toBeInTheDocument()

            // The checkbox should be checked, which is a visual indication
            const checkbox = screen.getByRole('checkbox')
            expect(checkbox).toBeChecked()
        })
    })

    describe('Interactions', () => {
        it('calls onToggle when checkbox is clicked', () => {
            const task: Task = { id: 123, text: 'Test task', completed: false }

            renderTodoItem(task, mockOnToggle, mockOnRemove)

            const checkbox = screen.getByRole('checkbox')
            fireEvent.click(checkbox)

            expect(mockOnToggle).toHaveBeenCalledTimes(1)
            expect(mockOnToggle).toHaveBeenCalledWith(123)
        })

        it('calls onRemove when delete button is clicked', () => {
            const task: Task = { id: 456, text: 'Test task', completed: false }

            renderTodoItem(task, mockOnRemove, mockOnRemove)

            const deleteButton = screen.getByRole('button', { name: /delete/i })
            fireEvent.click(deleteButton)

            expect(mockOnRemove).toHaveBeenCalledTimes(1)
            expect(mockOnRemove).toHaveBeenCalledWith(456)
        })
    })

    describe('Edge Cases', () => {
        it('handles empty task text', () => {
            const task: Task = { id: 1, text: '', completed: false }

            renderTodoItem(task, mockOnToggle, mockOnRemove)

            // Should still render the list item structure
            expect(screen.getByRole('checkbox')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
        })

        it('handles very long task text', () => {
            const longText = 'A'.repeat(200)
            const task: Task = { id: 1, text: longText, completed: false }

            renderTodoItem(task, mockOnToggle, mockOnRemove)

            expect(screen.getByText(longText)).toBeInTheDocument()
        })

        it('handles special characters in task text', () => {
            const specialText = '<script>alert("test")</script> & "quotes" & \'apostrophes\''
            const task: Task = { id: 1, text: specialText, completed: false }

            renderTodoItem(task, mockOnToggle, mockOnRemove)

            expect(screen.getByText(specialText)).toBeInTheDocument()
        })
    })
})
