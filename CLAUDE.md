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

## Offering choices / next steps

- When you end a message by proposing what to do next, present the options as
  explicit **lettered choices** (**A:** … / **B:** … / **C:** …) so I can reply
  with just a letter. Never end with an open-ended "should I…?" that forces me to
  restate your suggestion or guess how you'll interpret a bare "yes."
- Prefer the `AskUserQuestion` tool's button choices when a clarification fits.
  When answering in prose instead, still give the lettered A/B/C list.
- Always include a "stop / do nothing / not now" style option when it's relevant.
