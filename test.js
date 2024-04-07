const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

async function loginUser() {
    let options = new firefox.Options();
    options.setAcceptInsecureCerts(true);

    let driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
  
  try {
    // Navigate to the login page
    await driver.get('https://localhost/login.html',10000);

    // Fill in the form
await driver.findElement(By.id('email')).sendKeys('test@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('cringe', Key.RETURN);

    // Wait for redirection to homepage
    await driver.wait(until.titleIs('Home - Blog Application'), 10000); 
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await driver.quit();
  }
}

loginUser();

