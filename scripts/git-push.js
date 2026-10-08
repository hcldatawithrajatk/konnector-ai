const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const readline = require('readline');

const repoDir = process.cwd();

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function push() {
  const token = process.env.GITHUB_TOKEN || await prompt('Enter your GitHub Personal Access Token (or press Enter to use GITHUB_TOKEN env var): ');

  if (!token) {
    console.error('Error: GitHub Personal Access Token is required to authenticate push.');
    console.log('You can generate one at: https://github.com/settings/tokens (select "repo" scope).');
    process.exit(1);
  }

  const username = process.env.GITHUB_USERNAME || 'hcldatawithrajatk';
  const remoteUrl = `https://github.com/${username}/konnector-ai.git`;

  console.log(`Pushing to ${remoteUrl}...`);

  try {
    console.log('Pushing "main" branch...');
    const pushResultMain = await git.push({
      fs,
      http,
      dir: repoDir,
      remote: 'origin',
      ref: 'main',
      force: true,
      onAuth: () => ({ username, password: token }),
    });
    console.log('Successfully pushed "main" branch!', pushResultMain);

    console.log('Pushing "develop" branch...');
    const pushResultDev = await git.push({
      fs,
      http,
      dir: repoDir,
      remote: 'origin',
      ref: 'develop',
      force: true,
      onAuth: () => ({ username, password: token }),
    });
    console.log('Successfully pushed "develop" branch!', pushResultDev);

    console.log('Pushing tags...');
    await git.push({
      fs,
      http,
      dir: repoDir,
      remote: 'origin',
      ref: 'refs/tags/v1.0.0',
      force: true,
      onAuth: () => ({ username, password: token }),
    });
    console.log('Successfully pushed tag "v1.0.0"!');
    console.log(`\n🎉 All code has been successfully pushed to https://github.com/${username}/konnector-ai`);
  } catch (error) {
    console.error('Push failed with error:', error.message || error);
    if (error.data) {
      console.error('Error details:', error.data);
    }
  }
}

push();
