var configData=require('..\\test_data\\config_data.json');
var commonFunctions=require('..\\lib\\commonFunctions');
var newRequest_data=require('..\\test_data\\newRequest_data.json');
var otherTest_data=require('..\\test_data\\otherTest_data.json');
var loginPage=require('..\\page_objects\\login_PO.js');
var dashBoardPage=require('..\\page_objects\\homePage_PO.js');
var addNewRequestPage=require('..\\page_objects\\addNewRequest_PO.js');
var creativeBriefPage=require('..\\page_objects\\creativeBrief_PO.js');

describe('Creative Brief',function(){
    var EC =protractor.ExpectedConditions;
    beforeAll(async function(){
        await loginPage.navigateToPortal(configData.loginurl.QA);
        await browser.waitForAngularEnabled(false);
        await loginPage.loginToPortal(configData.TrafficManager_username,configData.TrafficManager_password);
        await browser.executeScript('window.scrollTo(0,10000);');
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
    })
    it('should be able to navigate to Add Creative Brief page from Submit Request',async function(){
        await dashBoardPage.navigateToAddCreativeBrief();
        await browser.wait(EC.visibilityOf(creativeBriefPage.addCreativeBriefPanel),10000,'Add creative brief not loaded');
        expect(creativeBriefPage.addCreativeBriefPanel.isDisplayed()).toBe(true);
        await browser.wait(EC.elementToBeClickable(creativeBriefPage.startDate),10000,'start Date not clickable');
        await browser.wait(EC.elementToBeClickable(creativeBriefPage.comments),10000,'comments not clickable');
        await browser.wait(EC.presenceOf(creativeBriefPage.upload),10000,'upload not displayed');
        //await creativeBriefPage.startDate.click();
        expect(creativeBriefPage.titleInput.isDisplayed()).toBe(true);
        expect(creativeBriefPage.startDate.isDisplayed()).toBe(true);
        expect(creativeBriefPage.approvalDueDate.isDisplayed()).toBe(true);
        expect(creativeBriefPage.approverName.isDisplayed()).toBe(true);
        expect(creativeBriefPage.upload.isPresent()).toBe(true);
        expect(creativeBriefPage.comments.isDisplayed()).toBe(true);
    })
  xit('should be able to submit Add Creative Brief',async function(){
    await creativeBriefPage.fillAddCreativeBrief(otherTest_data.CreativeBriefData.CreativeBriefTitle,otherTest_data.CreativeBriefData.ApproverName,otherTest_data.CreativeBriefData.Comments,otherTest_data.CreativeBriefData.fileToUpload);
    expect(await creativeBriefPage.uploadedFile.getText()).toMatch("\s*test.pptx\s*");
    browser.executeScript('window.scrollTo(0,10000);');
    await browser.wait(EC.elementToBeClickable(creativeBriefPage.submitbtn),10000,'submitbtn not clickable');
    await creativeBriefPage.submitbtn.click();
    await browser.wait(EC.visibilityOf(creativeBriefPage.creativeBriefCreatedMsg),10000,'creativeBriefCreatedMsg not displayed');
    await browser.wait(EC.invisibilityOf(creativeBriefPage.creativeBriefCreatedMsg),10000,'creativeBriefCreatedMsg not disappeared');
    
    })
    describe('Actions',function(){
        it('should be able to Approve creative brief',async function(){
            //logout from application
            await dashBoardPage.logoutFromApplication();
            await browser.wait(EC.visibilityOf(loginPage.userName),10000,'Login screen not loaded');
            //login as approver
            await loginPage.loginToPortal(configData.CBApprover_username,configData.CBApprover_password);
            browser.executeScript('window.scrollTo(0,10000);');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            //Navigate to Creative Brief Tasks
            await browser.wait(EC.elementToBeClickable(dashBoardPage.creativeBriefTab),10000,'creativeBriefTab not clickable');
            await dashBoardPage.creativeBriefTab.click();
            
            //Click on Approve icon against created Creative Brief
            await creativeBriefPage.approveCreativeBrief("ryruydfud");
            
            
            

            browser.sleep(7000);
        })
    })

})