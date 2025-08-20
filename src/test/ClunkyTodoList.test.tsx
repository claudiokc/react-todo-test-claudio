import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ClunkyTodoList } from '../ClunkyTodoList'

// Create MUI theme for tests
const theme = createTheme()

// Helper function to render ClunkyTodoList with theme
const renderTodoList = () => {
    return render(
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ClunkyTodoList />
        </ThemeProvider>
    )
}

describe('ClunkyTodoList Component', () => {
    beforeEach(() => {
        // Clear any previous DOM
        document.body.innerHTML = ''
    })

    describe('Initial Rendering', () => {
        it('renders the todo list with header', () => {
            renderTodoList()

            expect(screen.getByText('📝 Todo List')).toBeInTheDocument()
            expect(screen.getByText(/3 items total/)).toBeInTheDocument()
        })

        it('renders default tasks', () => {
            renderTodoList()

            expect(screen.getByText('Learn React')).toBeInTheDocument()
            expect(screen.getByText('Write code')).toBeInTheDocument()
            expect(screen.getByText('Eat lunch')).toBeInTheDocument()
        })

        it('renders task input field', () => {
            renderTodoList()

            const input = screen.getByPlaceholderText('Add a new task...')
            expect(input).toBeInTheDocument()
        })

        it('renders add button', () => {
            renderTodoList()

            const addButton = screen.getByRole('button', { name: /add/i })
            expect(addButton).toBeInTheDocument()
        })

        it('renders filter chips', () => {
            renderTodoList()

            expect(screen.getByText('All')).toBeInTheDocument()
            expect(screen.getByText('Active')).toBeInTheDocument()
            expect(screen.getByText('Completed')).toBeInTheDocument()
            expect(screen.getByText('Multi-word')).toBeInTheDocument()
        })

        it('renders clear completed button', () => {
            renderTodoList()

            const clearButton = screen.getByText(/Clear Completed/)
            expect(clearButton).toBeInTheDocument()
        })

        it('shows completion summary', () => {
            renderTodoList()

            expect(screen.getByText('1 of 3 tasks completed')).toBeInTheDocument()
        })
    })

    describe('Adding Tasks', () => {
        it('adds a new task when add button is clicked', async () => {
            const user = userEvent.setup()
            renderTodoList()

            const input = screen.getByPlaceholderText('Add a new task...')
            const addButton = screen.getByRole('button', { name: /add/i })

            await user.type(input, 'New test task')
            await user.click(addButton)

            expect(screen.getByText('New test task')).toBeInTheDocument()
            expect(screen.getByText(/4 items total/)).toBeInTheDocument()
        })

        it('adds a new task when Enter key is pressed', async () => {
            const user = userEvent.setup()
            renderTodoList()

            const input = screen.getByPlaceholderText('Add a new task...')

            await user.type(input, 'Task via Enter key{enter}')

            expect(screen.getByText('Task via Enter key')).toBeInTheDocument()
        })

        it('clears input field after adding task', async () => {
            const user = userEvent.setup()
            renderTodoList()

            const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement
            const addButton = screen.getByRole('button', { name: /add/i })

            await user.type(input, 'Test task')
            await user.click(addButton)

            expect(input.value).toBe('')
        })

        it('does not add empty tasks', async () => {
            renderTodoList()

            const addButton = screen.getByRole('button', { name: /add/i })

            // Button should be disabled when input is empty
            expect(addButton).toBeDisabled()

            // Should still have only 3 original tasks
            expect(screen.getByText(/3 items total/)).toBeInTheDocument()
        })

        it('does not add tasks with only whitespace', async () => {
            const user = userEvent.setup()
            renderTodoList()

            const input = screen.getByPlaceholderText('Add a new task...')

            await user.type(input, '   ')

            // Even with whitespace, the trimmed value is empty, so button should be disabled
            const addButton = screen.getByRole('button', { name: /add/i })
            expect(addButton).toBeDisabled()

            // Should still have only 3 original tasks
            expect(screen.getByText(/3 items total/)).toBeInTheDocument()
        })

        it('disables add button when input is empty', () => {
            renderTodoList()

            const addButton = screen.getByRole('button', { name: /add/i })
            expect(addButton).toBeDisabled()
        })

        it('enables add button when input has text', async () => {
            const user = userEvent.setup()
            renderTodoList()

            const input = screen.getByPlaceholderText('Add a new task...')
            const addButton = screen.getByRole('button', { name: /add/i })

            await user.type(input, 'New task')

            expect(addButton).not.toBeDisabled()
        })
    })

    describe('Task Interactions', () => {
        it('toggles task completion when checkbox is clicked', async () => {
            const user = userEvent.setup()
            renderTodoList()

            // Find the "Learn React" task checkbox (it should be unchecked initially)
            const checkboxes = screen.getAllByRole('checkbox')
            const learnReactCheckbox = checkboxes[0] // First task

            expect(learnReactCheckbox).not.toBeChecked()

            await user.click(learnReactCheckbox)

            expect(learnReactCheckbox).toBeChecked()
            expect(screen.getByText('2 of 3 tasks completed')).toBeInTheDocument()
        })

        it('removes task when delete button is clicked', async () => {
            const user = userEvent.setup()
            renderTodoList()

            const deleteButtons = screen.getAllByRole('button', { name: /delete/i })

            await user.click(deleteButtons[0])

            expect(screen.queryByText('Learn React')).not.toBeInTheDocument()
            expect(screen.getByText(/2 items total/)).toBeInTheDocument()
        })
    })

    describe('Filtering', () => {
        it('shows all tasks by default', () => {
            renderTodoList()

            expect(screen.getByText('Learn React')).toBeInTheDocument()
            expect(screen.getByText('Write code')).toBeInTheDocument()
            expect(screen.getByText('Eat lunch')).toBeInTheDocument()
        })

        it('filters to show only active tasks', async () => {
            const user = userEvent.setup()
            renderTodoList()

            const activeChip = screen.getByText('Active')
            await user.click(activeChip)

            expect(screen.getByText('Learn React')).toBeInTheDocument()
            expect(screen.queryByText('Write code')).not.toBeInTheDocument() // completed task
            expect(screen.getByText('Eat lunch')).toBeInTheDocument()
        })

        it('filters to show only completed tasks', async () => {
            const user = userEvent.setup()
            renderTodoList()

            const completedChip = screen.getByText('Completed')
            await user.click(completedChip)

            expect(screen.queryByText('Learn React')).not.toBeInTheDocument()
            expect(screen.getByText('Write code')).toBeInTheDocument() // completed task
            expect(screen.queryByText('Eat lunch')).not.toBeInTheDocument()
        })

        it('filters to show only multi-word tasks', async () => {
            const user = userEvent.setup()
            renderTodoList()

            const multiwordChip = screen.getByText('Multi-word')
            await user.click(multiwordChip)

            expect(screen.getByText('Learn React')).toBeInTheDocument() // 2 words
            expect(screen.getByText('Write code')).toBeInTheDocument() // 2 words  
            expect(screen.getByText('Eat lunch')).toBeInTheDocument() // 2 words
        })

        it('shows empty state message when filter returns no results', async () => {
            const user = userEvent.setup()
            renderTodoList()

            // Add a single-word task
            const input = screen.getByPlaceholderText('Add a new task...')
            const addButton = screen.getByRole('button', { name: /add/i })

            await user.type(input, 'SingleWordTask')
            await user.click(addButton)

            // Clear all original tasks to have only single-word task
            const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
            for (const button of deleteButtons.slice(0, 3)) {
                await user.click(button)
            }

            // Filter by multi-word
            const multiwordChip = screen.getByText('Multi-word')
            await user.click(multiwordChip)

            expect(screen.getByText('No multiword tasks found.')).toBeInTheDocument()
        })

        it('updates filter chip appearance when selected', async () => {
            const user = userEvent.setup()
            renderTodoList()

            const activeChip = screen.getByText('Active')
            const allChip = screen.getByText('All')

            // All should be selected by default (filled variant)
            expect(allChip.closest('.MuiChip-filled')).toBeInTheDocument()

            await user.click(activeChip)

            // Active should now be selected
            expect(activeChip.closest('.MuiChip-filled')).toBeInTheDocument()
        })
    })

    describe('Clear Completed Functionality', () => {
        it('removes all completed tasks when clear completed is clicked', async () => {
            const user = userEvent.setup()
            renderTodoList()

            const clearButton = screen.getByRole('button', { name: /Clear Completed/ })

            await user.click(clearButton)

            expect(screen.queryByText('Write code')).not.toBeInTheDocument()
            expect(screen.getByText(/2 items total/)).toBeInTheDocument()
            expect(screen.getByText('0 of 2 tasks completed')).toBeInTheDocument()
        })

        it('disables clear completed button when no tasks are completed', async () => {
            const user = userEvent.setup()
            renderTodoList()

            // First clear all completed tasks
            const clearButton = screen.getByRole('button', { name: /Clear Completed/ })
            await user.click(clearButton)

            // Button should now be disabled
            expect(clearButton).toBeDisabled()
        })

        it('shows correct count in clear completed button', () => {
            renderTodoList()

            expect(screen.getByText('Clear Completed (1)')).toBeInTheDocument()
        })
    })

    describe('Edge Cases and Error Handling', () => {
        it('handles adding tasks with special characters', async () => {
            const user = userEvent.setup()
            renderTodoList()

            const input = screen.getByPlaceholderText('Add a new task...')
            const addButton = screen.getByRole('button', { name: /add/i })
            const specialText = 'Task with <script> & "quotes" & émojis 🎉'

            await user.type(input, specialText)
            await user.click(addButton)

            expect(screen.getByText(specialText)).toBeInTheDocument()
        })

        it('handles empty state correctly', async () => {
            const user = userEvent.setup()
            renderTodoList()

            // Remove all tasks
            const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
            for (const button of deleteButtons) {
                await user.click(button)
            }

            expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument()
            expect(screen.getByText(/0 items total/)).toBeInTheDocument()
        })

        it('updates counts correctly after all operations', async () => {
            const user = userEvent.setup()
            renderTodoList()

            // Add a task
            const input = screen.getByPlaceholderText('Add a new task...')
            const addButton = screen.getByRole('button', { name: /add/i })

            await user.type(input, 'New task')
            await user.click(addButton)

            expect(screen.getByText(/4 items total/)).toBeInTheDocument()

            // Toggle a task
            const checkboxes = screen.getAllByRole('checkbox')
            await user.click(checkboxes[0])

            expect(screen.getByText('2 of 4 tasks completed')).toBeInTheDocument()

            // Clear completed
            const clearButton = screen.getByRole('button', { name: /Clear Completed/ })
            await user.click(clearButton)

            expect(screen.getByText(/2 items total/)).toBeInTheDocument()
            expect(screen.getByText('0 of 2 tasks completed')).toBeInTheDocument()
        })
    })
})
