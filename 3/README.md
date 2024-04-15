# Team members

- Adham Hazem Fahmy Shafei - 20206011
- Omar Adel Abdel Hamid Ahmed Brikaa - 20206043
- Mostafa Ahmed Mohammed Ahmed Ibrahim - 20206073
- Ali Esmat Ahmed Orfy - 20206123

# Application description

## Introduction

[Engineer Man Knowledge Center](https://emkc.org) is a web platform that hosts programming contests, challenges and
user-created snippets. This repository is a fork of the [original EMKC repository](https://github.com/engineer-man/emkc).

## Brief description of the functionalities

- Users can create and log into their accounts on the platform using their Discord accounts (OAuth2)
- Challenges can be created (access control mechanisms will be discussed later)
- Users can submit solutions to active challenges
- Users can see other users challenge solutions if they have solved the same challenge
- Contests can be created (access control mechanisms will be discussed later)
- Users can submit solutions to active contests
- After a contest ends, users can see other submissions
- Users can create snippets
- Users can see their snippets and other users' snippets
- Users can see their profile and achievements
- Discord messages on EngineerMan's server are logged into the database
- Successful code executions on the external code execution API (Piston) are logged
- The platform also acts as a proxy to the Piston code execution API that implements rate-limiting

# Implemented security measures

## Security measures that have already existed

### Authentication

- Integrating with Discord for log in is done using the [OAuth2 protocol](https://auth0.com/intro-to-iam/what-is-oauth-2)

### Authorization and access control

- There are users with different authorities: staff members, normal users, users with unlimited code execution requests per second, users with internal api keys (usually bots).

  - The authorities of each role are defined in `src/platform/config/policies.js`
  - Staff members can do things like: managing challenges/contests, revalidating submissions in contests (after, for example, adding new test cases) and logging in as other users (for troubleshooting)
  - Users (bots) with internal API keys can log Discord messages sent on Engineer Man's Discord server to the database and can log code executions to the database

- Users can see other users challenge solutions only if they have solved the same challenge

  - `src/platform/api/controllers/ChallengesController.js:420`

- Users can only see their own submissions while a contest is active, and can see other submissions once the contest is
  done

  - The API does not return the submissions of other users while the contest is active (both backend and frontend ensuring)

- Users can only edit snippets that they have created
  - `src/platform/api/controllers/SnippetsController.js:119`

### SQL injection protection

- The project uses Sequelize ORM which provides protection against SQL injection
  - Sometimes vulnerabilities are discovered in Sequelize which allow for SQL injection; but no vulnerable feature is used in the project (the vulnerable features are reported in `additional-reports/npm-audit-report.txt`)

### XSS protection

- The project uses React on the frontend which automatically sanitizes external inputs to the DOM
  - Some exceptions to this are usages of `dangerouslySetInnerHTML`, but this function is only used on inputs from
    staff members

## New security measures

### Authorization and access control

- Staff members have been separated into:
  - Superusers: these have permissions to do anything staff members could do previously, in addition to (un)setting other users as staff members, contest authors and challenge authors
  - Contest/challenge authors: these have permissions to manage contests/challenges
  - This change allows us to get more users to help us with creating contests and challenges without giving them access to dangerous operations that can be done on the platform

### Confidentiality

- The following are now stored encrypted in the database using the AES-192-CBC encryption algorithm:
  - Contest submissions
  - Challenge submissions
  - Discord chat messages
  - The source of code execution on the code execution API (Piston)
  - Users' emails (they are retrieved from Discord API)

### DOS protection (via input validation and error handling)

- The server could crash if the user modified the POST request of the contest submission to submit to an invalid contest, this has been fixed and proper error handling at that endpoint has been implemented.

### Safe error messages (via input validation and error handling)

- The server leaked the name of a database column in the error message when the user modified the POST request body of snippet creation to set the language to 'null'. This has been fixed, and proper error handling has been implemented at that endpoint.

# Penetration testing

## Simulated attacks using a Nodejs script

The `attacks/attacks.js` simulates the following attacks on the website:

### XSS attack

The script, as a superuser, creates a challenge that contains an XSS injected unsafe form.
This vulnerability has not been addressed since, as we discussed, the challenges are typically created by trusted individuals.

### Viewing a future contest as an unauthorized user attack

The script, as a superuser, creates a contest that starts in the future.
The script then, as a normal user, accesses this contest using its link and is successful in doing so.
This has not been addressed for convenience. We usually like to receive feedback from certain users on future contests so we send them the future contest link and let them access it. Other users usually won't be able to access that future contest since they do not have the link (security through obscurity).

### Viewing a draft challenge as an unauthorized user attack

The script, as a superuser, creates a "draft" challenge which only superusers/challenge authors are supposed to see.
The script then, as a normal user, accesses this challenge using its link and is successful in doing so.
This has not been addressed for similar reasons to the contests attack. Also, currently, accessing a draft challenge is not a critical security vulnerability since drafts exist for allowing challenge authors to continue working on the challenge later.

### Exposing a database column attack

The script, as a normal user, creates a POST request to the snippet creation endpoint with a null language.
The server, as a result, responds with the error from the database which includes a column name in the snippets table.
This has been addressed as mentioned above.

### DOS attack

The script, as a normal user, creates a POST request to the contest submission endpoint with an invalid contest id.
The server, as a result, does not handle this and crashes.
This has been addressed as mentioned above.

## Determining vulnerable npm packages

The `npm audit` command has been run and a report containing npm packages that have security vulnerabilities has been generated at: `additional-reports/npm-audit-report.txt`

## Automated penetration testing via ZAP

The ZAP penetration testing tool has been used to perform automated penetration testing and a report has been generated at: `additional-reports/zap-report.pdf`

# Recommendations for improving the application's security

- If more challenge/contest authors are to be added (those who are not necessarily in our trust network), then sanitization needs to be done on inputs to `dangerouslySetInnerHTML`.
- If future contests are to become critically secret, then access control should be implemented on future contests to only allow contest authors and superusers to access them. Similarly with draft challenges and challenge authors.
- Update the NPM dependencies to their latest versions to avoid security vulnerabilities that may exist in older versions.
- Use modern alternative to obsolete npm packages such as moment
- In addition to handling errors at each controller action, global error handling with proper logging should be implemented to avoid server crashes in unexpected cases.
- Unit tests, integration tests, system tests and penetration tests should be employed to test all edge cases and achieve code coverage.
- Consider using Typescript instead of Javascript to ensure type-safety and to catch type errors at compile time.
- Consider assigning a challenge author and a contest author to each challenge and contest to audit and trace who created that challenge or contest.
