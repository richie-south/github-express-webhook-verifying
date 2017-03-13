# github-express-webhook-verifying [![npm version](https://badge.fury.io/js/github-express-webhook-verifying.svg)](https://badge.fury.io/js/github-express-webhook-verifying)

Validating payloads from GitHub

## Install:

```
npm install github-express-webhook-verifying --save
```

## How to use:

Basic
```javascript

// You also need to use body-parser in express
app.use(bodyParser.json())

const verifyGithubWebhook = require('github-express-webhook-verifying')
const secret = 'MySecret!'

router.get('/', verifyGithubWebhook(secret), (req, res) => {
  // Webhook is verifyed here!
})

```

With config
```javascript

// You also need to use body-parser in express
app.use(bodyParser.json())

const verifyGithubWebhook = require('github-express-webhook-verifying')
const secret = 'MySecret!'
const config = {
  xHubSignatureNotFound: {
    status: 400,
    errorMessage: 'My custom message',
  },
  verifyingSignatureFailed: {
    status: 403,
    errorMessage: 'My other custom message',
  },
}

router.get('/', verifyGithubWebhook(secret, config), (req, res) => {
  // Webhook is verifyed here!
})

```

## TODO

- Tests
