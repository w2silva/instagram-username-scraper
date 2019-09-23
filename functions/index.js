const admin = require('firebase-admin');
const functions = require('firebase-functions');
const puppeteer = require('puppeteer')
const cors = require('cors')({
  origin: true
})
const opts = { memory: "2GB", timeoutSeconds: 30 }

admin.initializeApp()

const selectors = {
  url: 'https://www.instagram.com/',
  input: '[name=username]',
  errorIcon: 'span.coreSpriteInputError'
}

async function checkAvailableUsername(username) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.goto(selectors.url, {
    waitUntil: ['load', 'domcontentloaded']
  })

  await page.waitForSelector(selectors.input)
  await page.type(selectors.input, username)
  await page.click('body')

  try {
    await page.waitForSelector(selectors.errorIcon, {
      visible: true,
      timeout: 250
    })

    return false
  } catch (e) {
    return true
  } finally {
    await browser.close()
  }
}

exports.check_username_private = functions
  .runWith(opts)
  .https
  .onCall(({ username = "" }, context) => {
    // Checking attribute.
    if (!(typeof username === 'string') || username.length === 0) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
          'one arguments "username" containing the message text to add.');
    }

    return checkAvailableUsername(username)
  })

exports.check_username = functions
  .runWith(opts)
  .https
  .onRequest(async (req, res) => {
    if (req.method !== "GET") {
      return res.status(403).json({
        message: "FORBIDDEN"
      });
    }

    return await cors(req, res, async () => {
      const { username = '' } = req.query
      return res.status(200).json({
        available: await checkAvailableUsername(username)
      })
    })
  })