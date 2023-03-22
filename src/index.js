const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function getDiff(prNumber, octokit, repo) {
    const { data: diff } = await octokit.rest.pulls.get({
        owner: repo.owner,
        repo: repo.repo,
        pull_number: prNumber,
        mediaType: { format: 'diff' },
    });
    return diff;
}

async function getExplanation(diff, openaiToken) {
    const chatGptApiUrl = 'https://api.openai.com/v1/chat/completions';
    const prompt = `Explain the following code changes with at least words as possible:\n\n${diff}`;

    const response = await axios.post(chatGptApiUrl, {
        prompt: prompt,
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: 0.5,
    }, {
        headers: {
            'Authorization': `Bearer ${openaiToken}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data.choices[0].text.trim();
}

async function commentOnPr(prNumber, explanation, octokit, repo) {
    await octokit.rest.issues.createComment({
        owner: repo.owner,
        repo: repo.repo,
        issue_number: prNumber,
        body: explanation,
    });
}

async function run() {
    try {
        const token = core.getInput('github-token', { required: true });
        const openaiToken = core.getInput('openai-token', { required: true });
        const octokit = github.getOctokit(token);
        const prNumber = github.context.payload.pull_request.number;
        const repo = github.context.repo;

        const diff = await getDiff(prNumber, octokit, repo);
        const explanation = await getExplanation(diff, openaiToken);
        await commentOnPr(prNumber, explanation, octokit, repo);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
