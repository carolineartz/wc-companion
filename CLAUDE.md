# Working preferences

## Pull requests

- You may open pull requests **without asking for confirmation first**. When a
  change is ready to share, go ahead and create the PR (base `main`, head =
  the current working branch) rather than pausing to ask whether to open one.
- Still pause to ask before other outward-facing or hard-to-reverse actions
  (e.g. merging, force-pushing, deleting branches) unless told otherwise.

## Quality gates

Before opening a PR, make sure these pass: `npm run lint`, `npm run typecheck`,
`npm test`, `npm run build`. CI runs the same four.
