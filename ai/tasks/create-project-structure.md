# Instructions to create or update the Project Structure documentation

## Task

Generate or update the `project-structure.md` file located in `ai/contexts/` to help AI agents understand the codebase organization.

## Steps

1. **Analyze Workspace Context**:
   - Read the `<workspace_info>` to identify the primary directories.
   - Use terminal tools to run and get the response of `git ls-files | grep -v ".github/\|ai/"` to list the files and folders.

2. **Understand Folder Purposes**:
   - For each main folder, read a sample of its files using `read/readFile` to infer its responsibility.
   - If a folder's purpose is ambiguous, use `interaction/askUser` to clarify with the user.

3. **Format the Structure**:
   - Create a one-line description for each significant folder or file, even if the like is self-explanatory or too long.
   - Use the following model for the file content:

   ```markdown
   # Project Structure

   ### Overview of the Project Structure

   - prisma: Contains database schema
   - src/cron: Contains the CronManager class
   - src/cron/jobs: Contains the Cron Jobs implementations
   - src/generated: Prisma generated types
   - src/lib: Integrations with third-party services or libraries
   - src/platformPublishing: Platform publishing code
   - src/services: database prisma operations
   - src/types: shared types across the project
   - src/utils: utility functions and helpers
   - src/workflows: Workflow implementations jobs to collect data for the company, plan posts, and any background tasks that demands time.
   - src/server.ts: Cron jobs and APIs entry point.

   Remember <workspace_info>, so that you can have better understanding of how to name files based on the current project structure and conventions.
   ```

4. **Confirm and Save**:
   - Present the drafted structure to the user using `interaction/confirmAction`.
   - Once approved, use `edit/createFile` to save the content to `ai/contexts/project-structure.md`.
