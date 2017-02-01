# github-express-webhook-verifying

Validating payloads from GitHub

## Install:

```
npm install github-express-webhook-verifying --save
```

## How to use:

```javascript

// You also need to use body-parser in express
app.use(bodyParser.json())

const verifyGithubWebhook = require('github-express-webhook-verifying')
const secret = 'MySecret!'

router.get('/', verifyGithubWebhook(secret), (req, res) => {
  // Webhook is verifyed here!
})

```