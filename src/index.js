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


async function getExplanation(diff, openaiToken, model) {
    const chatGptApiUrl = 'https://api.openai.com/v1/chat/completions';
    const prompt = `Explain the following code changes with as few words as possible:\n\n${diff}`;
    try {
        const response = await axios.post(chatGptApiUrl, {
            model: model,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that translates code changes into human-readable explanations."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
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

        if (response.data.choices && response.data.choices[0] && response.data.choices[0].message && response.data.choices[0].message.content) {
            return (response.data.choices[0].message.content);
        } else {
            console.error('Error: Unexpected response format');
        }
    } catch (error) {
        console.error('Error:', error);
    }
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
        const model = core.getInput('model') || "gpt - 3.5 - turbo";
        const octokit = github.getOctokit(token);
        const prNumber = github.context.payload.pull_request.number;
        const repo = github.context.repo;
        const diff = await getDiff(prNumber, octokit, repo);
        const explanation = await getExplanation(diff, openaiToken, model);
        await commentOnPr(prNumber, explanation, octokit, repo);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
