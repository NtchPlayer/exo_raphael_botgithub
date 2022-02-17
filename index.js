const Bot = require('./bot')

const run = async () => {
  const bot = new Bot()

  await bot.init()
    .then(() => {
      console.log('init Puppeteer')
    })

  await bot.visitGithub()
    .then(() => {
      console.log('Visiting Github')
    })

  await bot.visitPage()
    .then(() => {
      console.log('Visiting Page')
    })

  await bot.closeBrowser().then(() => {
    console.log('Closing Browser')
  })
}

run()
  .catch((e) => {
    console.log('Error:', e)
  })
