'use strict'

const crypto = require('crypto')
const bufferEq = require('buffer-equal-constant-time')

const xHubSignatureNotFound = 'xHubSignatureNotFound'
const verifyingSignatureFailed = 'verifyingSignatureFailed'

const defaultConfig = {
  [xHubSignatureNotFound]: {
    status: 400,
    errorMessage: 'No signature found in headers',
  },
  [verifyingSignatureFailed]: {
    status: 403,
    errorMessage: 'Verifying signature failed',
  },
}

const sign = (secret, data) => 
  'sha1=' + crypto.createHmac('sha1', secret).update(data).digest('hex')

/**
 * Compares in equal time
 * @param {String} secret    [secret to compare sign with]
 * @param {String} data      []
 * @param {String} signature [compare secret with]
 * @returns {Boolean} [is same]
 */
const verifySignature = (secret, data, signature) => 
  bufferEq(new Buffer(signature), new Buffer(sign(secret, data)))

/**
 * Verify github secret on request
 * @param {String} secret [string to compare with]
 * @param {Object} config [object with default props]
 */
const verifySecret = (secret, config = defaultConfig) => {
  if(typeof secret !== 'string'){
    throw new TypeError(`Secret must be string! Secret type is: ${typeof secret}`)
  }

  const { 
    [xHubSignatureNotFound]: { 
      status: xHubStatus, 
      errorMessage: xHubErrorMessage,
    },
    [verifyingSignatureFailed]: {
      status: signatureStatus,
      errorMessage: signatureErrorMessage,
    },
  } = config

  /**
   * Express middleware function
   */
  return (req, res, next) => {
    const sign = req.headers['x-hub-signature']
    if(!sign){
      return res.status(xHubStatus).send({
        error: xHubErrorMessage,
      })
    }

    if(!verifySignature(secret, JSON.stringify(req.body), sign)){
      return res.status(signatureStatus).send({
        error: signatureErrorMessage,
      })
    }

    next()
  }
}

module.exports = verifySecret