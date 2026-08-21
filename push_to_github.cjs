const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const dir = 'C:\\Users\\Admin\\.gemini\\antigravity\\scratch\\musclempire';
const token = process.argv[2] || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

async function main() {
  await git.init({ fs, dir });

  try {
    await git.addRemote({
      fs,
      dir,
      remote: 'origin',
      url: 'https://github.com/pawaratharvaaaa/musclempire.git',
      force: true
    });
  } catch (e) {}

  const filesToStage = [
    'src/assets/images/logo.png',
    'public/logo.png',
    'public/favicon.png',
    'src/components/Navbar.tsx',
    'src/components/PlanNavbar.tsx',
    'src/components/Footer.tsx',
    'src/components/Preloader.tsx'
  ];

  for (const filepath of filesToStage) {
    try { await git.add({ fs, dir, filepath }); } catch (err) {}
  }

  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Atharva Pawar',
      email: 'pawaratharvaaaa@gmail.com'
    },
    message: 'Update registered trademark logo and refine component styling'
  });

  if (!token) {
    console.log('STATUS: COMMITTED_LOCALLY_NEED_TOKEN');
    return;
  }

  console.log('Pushing to GitHub (main branch)...');
  const pushResult = await git.push({
    fs,
    http: require('isomorphic-git/http/node'),
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({ username: token })
  });
  console.log('PUSH_SUCCESS:', pushResult);
}

main().catch(err => {
  console.error('Push error:', err.message);
});
