const fetch = require('node-fetch');

async function test() {
  const res = await fetch('https://api.github.com/users/shadcn/repos?sort=pushed&per_page=30&type=owner', {
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  });
  console.log("Status:", res.status);
  console.log("Headers:", res.headers.raw()['x-ratelimit-remaining']);
  const body = await res.json();
  if (!res.ok) console.log(body);
  else console.log("Success, found repos:", body.length);
}
test();
