const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

async function createAccount() {
  let options = new firefox.Options();
  options.setAcceptInsecureCerts(true);

  let driver = new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
  
  try {
    await driver.get('http://localhost:3000/register.html');

    await driver.findElement(By.id('name')).sendKeys('Tester');
    await driver.findElement(By.id('email')).sendKeys('CRINGE12@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('input[type="submit"]')).click();
    await driver.wait(until.titleIs('Login - Blog app'), 10000); 
  } finally {
    await driver.quit();
  }
}

createAccount();
