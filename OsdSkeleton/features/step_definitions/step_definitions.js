const { Given, When, Then } = require('cucumber');
const webdriver = require('selenium-webdriver');
const browser = new webdriver.Builder().usingServer().withCapabilities({'browserName':'chrome'}).build()
const timeout = 3000
browser.get("http://localhost:8080/")
const mapButtonID = {
    "play": "playButton",
    "stop": "stopButton",
    "pause": "pauseButton",
    "fastForward": "fastFowardButton",
    "fastBackward": "fastBackwardButton",
    "next": "nextButton",
    "previous": "previousButton"
}
Given('Button:{string}', function (button) {
    this.idButton = mapButtonID[button]
  });
When('I click on this button', function () {
    browser.wait(webdriver.until.elementLocated(webdriver.By.id(this.idButton)), timeout)
    browser.findElement(webdriver.By.id(this.idButton)).click();
});
Then('Close browser', function () {
    setTimeout(() => {
        browser.quit()
    }, 3000)
});