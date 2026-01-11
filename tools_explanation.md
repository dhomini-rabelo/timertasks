# Tool Explanations

## search/fileSearch

This tool searches for files in the workspace by glob pattern. It only returns the paths of matching files.

### Inputs
- `query`: A glob pattern to match file names or paths. Examples:
  - `**/*.{js,ts}` to match all .js and .ts files in the workspace.
  - `src/**` to match all files under the top-level src folder.
  - `**/foo/**/*.js` to match all .js files under any foo folder in the workspace.
- `maxResults` (optional): The maximum number of results to return. If not specified, only some matches are returned. Use this to limit results if needed.

### How the Input Works
The `query` parameter uses glob patterns to specify which files to find. Glob patterns support wildcards like `*` (matches any sequence of characters except path separators) and `**` (matches any sequence of characters including path separators, for recursive matching). The search is performed from the root of the workspace folder. If `maxResults` is set, it caps the number of returned file paths.

## search/textSearch

This tool performs a fast text search in the workspace. It searches for exact strings or regex patterns within files.

### Inputs
- `query`: The pattern to search for in files. Can be a plain text string or a regex pattern. Examples:
  - `'function|method|procedure'` to search for any of these words.
  - `'word1|word2|word3'` to find multiple potential words.
- `isRegexp`: A boolean indicating whether the `query` is a regex pattern (true) or plain text (false).
- `includePattern` (optional): A glob pattern to limit the search to files matching this pattern. Examples:
  - `"src/folder/**"` to search recursively inside a folder.
- `includeIgnoredFiles` (optional): A boolean to include files normally ignored by .gitignore or other ignore settings. Default is false. Warning: Setting this to true may slow down the search.
- `maxResults` (optional): The maximum number of results to return. If not specified, only some matches are returned.

### How the Input Works
The `query` is searched within the content of files in the workspace. If `isRegexp` is true, the `query` is treated as a regular expression, allowing for complex patterns. If false, it's a case-insensitive plain text search. The `includePattern` restricts the search to specific files or directories using glob patterns. `includeIgnoredFiles` controls whether ignored files (like those in node_modules) are included. The search is case-insensitive by default.