'use strict'

const crypto = require('crypto')
const bufferEq = require('buffer-equal-constant-time')

const sign = (secret, data) => 
  'sha1=' + crypto.createHmac('sha1', secret).update(data).digest('hex')

const verifySignature = (secret, data, signature) => 
  bufferEq(new Buffer(signature), new Buffer(sign(secret, data)))

const githubWebhook = (secret) => (req, res, next) => {
  if(typeof secret !== 'string'){
    throw new TypeError(`Secret must be string! Secret type is: ${typeof secret}`)
  }

  const sign = req.headers['x-hub-signature']
  if(!sign){
    return res.status(400).send({
      error: 'No signature found in headers',
    })
  }

  if(!verifySignature(secret, JSON.stringify(req.body), sign)){
    return res.status(403).send({
      error: 'verifying signature failed',
    })
  }

  next()
}

module.exports = githubWebhook

