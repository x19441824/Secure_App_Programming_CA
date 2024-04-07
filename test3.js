const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

async function createPost() {
  let options = new firefox.Options();
  options.setAcceptInsecureCerts(true);

  let driver = new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
  
  try {
    await driver.get('http://localhost:3000/create-post.html'); 

    await driver.findElement(By.id('title')).sendKeys('Selenium');
    await driver.findElement(By.id('content')).sendKeys('test ');
    await driver.findElement(By.id('author')).sendKeys('Test ');
    await driver.findElement(By.css('input[type="submit"]')).click();
    await driver.wait(until.titleIs('Home - Blog Application'), 10000); 
  } finally {
    await driver.quit();
  }
}

createPost();
