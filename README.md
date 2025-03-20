# React TODO Test

## Problem Description:

You're given a React application that implements a basic to-do list. However, it's poorly structured, has unnecessary complexity, and exhibits some minor functional issues.

This test is designed to understand your ability to understand a task, execute changes, and prepare a pull request for review.
As such, please resolve the tasks concisely.

## Pre-requisite setup (to be provided to candidate ahead of access to this repo)
Before requesting access to the code, the candidate should have a computer set up and ready to go.
Requirements:
- Git installed
- Node + Yarn installed globally
- A code editor of your choice

The test could take up to 90 minutes, when you've completed the above setup, and have the time 
available, request access to the code from OpenSolar.
Once access is provided a response from the candidate is expected within the 90 minute timeframe.
Information about the required tasks is included in the repositories README file. 

## Tasks

1. Fork this repository
2. Understand the existing code
3. Identify and fix any bugs or functional issues
4. Add new features
5. Refactor
6. Create a pull request, following best practices

### 1. Fork this repository:

First fork this repository into your personal Github account (a public fork).
As soon as you've checked out the code, please commit a trivial change as a timestamp of when you got started.

### 2. Understand the existing code:

Analyze the code and understand its current functionality. Add any comments you think are useful.

Please do not do major refactoring of the code until after completing the defined tasks below.
Keeping the code structurally unchanged helps with quickly seeing whether the changes done match our expectations.

### 3. Identify and fix any bugs or functional issues:

- Ensure the to-do list works correctly. Fix any bugs before moving on to code improvements.
- Make the todo list sit in the center of the page (horizontally and vertically).
- Clearly mark all commits as `bugfix:`, `cleanup:`, etc.

### 4. Add new features:

Please add these features in the simplest, most concise way possible.

- Add an '[x]' anchor element to the end of each item in the list to remove it from the list.
- Add a new button to remove all completed items from the list.
- Add another filter. Add a new filter to only show list items which contain two or more words. This should work in combination with the existing Active/Completed filter.

### 5. Refactor
Please move the list item renderer into its own component definition, and make any other structural or best-practice changes you
think could improve the demo.

### 6. Create a pull request, following best practices:

- Create a pull request in your own fork of the repository.
- Add a description to the pull request outlining the changes made.
- Add comments to any code changes which the reviewer might need some context to understand.

Send the pull request URL back to OpenSolar
