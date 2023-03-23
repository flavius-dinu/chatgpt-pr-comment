# chatgpt-pr-comment

This action takes as input a GIT_TOKEN and an OPENAI_TOKEN, sends the git diff to ChatGPT and comments on the PR with an explanation on what was changed on the PR.

## Usage Example
```
name: ChatGPT PR Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: Review code
        uses: flavius-dinu/chatgpt-pr-comment@0.6.0
        with:
          github-token: ${{ secrets.GIT_TOKEN }}
          openai-token: ${{ secrets.OPENAI_TOKEN }}
```