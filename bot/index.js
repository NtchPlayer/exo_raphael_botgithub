class GithubBot{
  constructor () {
    this.config = require('./config/puppeteer.json')
    this.creds = require('./config/creds')
  }

  async init () {
    const puppeteer = require('puppeteer')
    this.browser = await puppeteer.launch({
      headless: this.config.settings.headless
    })
    this.page = await this.browser.newPage()
    await this.page.setViewport({ width: 1920, height: 1080 })
  }

  async visitGithub () {

    // On accede à github
    await this.page.goto(this.config.baseUrl)
    await this.page.waitForTimeout(3000)

    // On accede à la page de connexion
    let btnLogin = await this.page.$x(this.config.selectors.btn_login)
    await btnLogin[0].click()
    await this.page.waitForNavigation()

    // On entre le username
    await this.page.waitForTimeout(1500)
    await this.page.focus(this.config.selectors.username_field)
    await this.page.keyboard.type(this.creds.username)

    // On entre le password
    await this.page.waitForTimeout(1500)
    await this.page.focus(this.config.selectors.password_field)
    await this.page.keyboard.type(this.creds.password)

    // await this.page.waitForTimeout(1500)
    // // On entre le clique sur le button de connexion
    // await this.page.click(this.config.selectors.login_button)
    //
    // await this.page.waitForNavigation()
  }

  async visitPage () {
    for (let i = 1; i <= this.config.number_page; i++) {
      await this.page.waitForTimeout(1500)
      console.log('Traitement de la page:', i)
      await this.page.goto(`${this.config.baseUrl}/search?p=${i}&q=${this.config.username}&type=${this.config.type}`)
      await this.page.waitForTimeout(1500)
      for (let r = 1; r <= 10; r++) { // On boucle sur chaque résultat
        await this.getUserInfo(this.page, r)
      }

    }
  }

  async getUserInfo (page, index) {
    let username = await page.$$eval(`#user_search_results > div.Box.border-0 > div:nth-child(${index}) > div.flex-auto > div:nth-child(1) > div.f4.text-normal > a.color-fg-muted > em`, (el) => {
      return el.map(e => e.innerText)
    })
    let description = await page.$$eval(`#user_search_results > div.Box.border-0 > div:nth-child(${index}) > div.flex-auto > p`, el => {
      if (el) {
        return el.map(e => e.innerText)
      } else {
        return 'no description'
      }
    })
    console.log(`username: ${username}, description: ${description[0] ? description : 'no description'}`)
  }

  async closeBrowser () {
    await this.browser.close()
  }
}

module.exports = GithubBot
