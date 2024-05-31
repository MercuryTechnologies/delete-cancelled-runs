const https = require('https');

const makeRequest = (options) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

(async () => {
  const sharedOptions = {
    hostname: 'api.github.com',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${process.env['INPUT_GITHUB-TOKEN']}`,
      'User-Agent': 'node.js',
      'X-GitHub-Api-Version': '2022-11-28',
    }
  };

  const response = await makeRequest({
    ...sharedOptions,
    method: 'GET',
    path: `/repos/${process.env.GITHUB_REPOSITORY}/actions/workflows/${process.env['INPUT_WORKFLOW-FILE']}/runs?status=cancelled&per_page=${process.env['INPUT_MAX-DELETIONS']}`,
  });

  await Promise.all(JSON.parse(response).workflow_runs.map(async (run) => {
    console.log(`Deleting cancelled workflow run: ${run.html_url}`);

    await makeRequest({
      ...sharedOptions,
      method: 'DELETE',
      path: `/repos/${process.env.GITHUB_REPOSITORY}/actions/runs/${run.id}`,
    });
  }));
})();
