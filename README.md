# chatgpt-pr-comment

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
      uses: <your-username>/<your-repo-name>@main
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        openai-token: ${{ secrets.OPENAI_TOKEN }}
```