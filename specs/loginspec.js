var configData=require('..\\test_data\\config_data.json');
var loginPage=require('..\\page_objects\\login_PO.js');
var dashBoardPage=require('..\\page_objects\\homePage_PO.js');

describe('when user navigates to Login Page',function(){
    var EC =protractor.ExpectedConditions;
    beforeAll(async function(){
        loginPage.navigateToPortal(configData.loginurl.QA);
    })

    it('should have all fields required for login',async function(){
        expect(loginPage.userName.isDisplayed()).toBe(true);
        expect(loginPage.password.isDisplayed()).toBe(true);
        expect(loginPage.loginbtn.isDisplayed()).toBe(true);
    })
    it('should be able to login',async function(){
        //await browser.waitForAngularEnabled(false);
      await loginPage.loginToPortal(configData.Requestor_username,configData.Requestor_password);
      /*await loginPage.userName.sendKeys("dws.requestor");
      browser.sleep(10000);
      browser.executeScript("arguments[0].value='uat'",loginPage.password);
        */
       await browser.waitForAngularEnabled(false);
      await browser.wait(EC.visibilityOf(dashBoardPage.myTaskstab),10000,'My tasks tab not loaded');
      expect(dashBoardPage.myTaskstab.isDisplayed()).toBe(true);
      browser.sleep(10000);
       })

})
