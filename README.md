# chatgpt-pr-comment

This action takes as input a GIT_TOKEN and an OPENAI_TOKEN, sends the git diff to ChatGPT and comments on the PR with an explanation on what was changed on the PR.

Optionally, you can specify a chatgpt model from this list: gpt-4, gpt-4-0314, gpt-4-32k, gpt-4-32k-0314, gpt-3.5-turbo, gpt-3.5-turbo-0301. 

By default gpt-3.5-turbo, will be used.

## Usage Example

Without specifying the model
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

Specifying the model:

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
        uses: flavius-dinu/chatgpt-pr-comment@1.0.0
        with:
          github-token: ${{ secrets.GIT_TOKEN }}
          openai-token: ${{ secrets.OPENAI_TOKEN }}
          chatgptmodel: "gpt-4"
```