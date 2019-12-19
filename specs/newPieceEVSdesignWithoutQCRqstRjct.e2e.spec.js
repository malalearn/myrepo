var configData=require('..\\test_data\\config_data.json');
var newRequest_data=require('..\\test_data\\newRequest_data.json');
var commonFunctions=require('..\\lib\\commonFunctions');
var loginPage=require('..\\page_objects\\login_PO.js');
var dashBoardPage=require('..\\page_objects\\homePage_PO.js');
var addNewRequestPage=require('..\\page_objects\\addNewRequest_PO.js');

describe("New Piece Request",function(){
    var EC =protractor.ExpectedConditions;
    var path = require('path');
    beforeAll(async function(){
        loginPage.navigateToPortal(configData.loginurl.QA);
        await browser.waitForAngularEnabled(false);
        console.log("Requestor login: "+ configData.Requestor_username);
        await loginPage.loginToPortal(configData.Requestor_username,configData.Requestor_password);
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
    });

    afterAll(async function(){
        dashBoardPage.logoutFromApplication();
        await browser.wait(EC.visibilityOf(loginPage.userName),10000,'Login screen not loaded');
    });

    it('should be able to raise New Piece Request',async function(){
      await dashBoardPage.navigateToAddNewRequest();
      await browser.wait(EC.visibilityOf(addNewRequestPage.workflowDetailsPanel),15000,'Add New Request menu not clickable');
      expect(addNewRequestPage.workflowDetailsPanel.isPresent()).toBe(true);
      //console.log("Request type selected by default:" + await addNewRequestPage.workflwRequestTypedropdown.$('option:checked').getText());
      await browser.wait(EC.elementToBeClickable(addNewRequestPage.workflwRequestTypedropdown),10000,'Request Type  not clickable');
      await browser.sleep(3000);
      expect(await addNewRequestPage.workflwRequestTypedropdown.$('option:checked').getText()).toMatch("\s*New Piece\s*");
      await addNewRequestPage.fillWorkflowDetails("NewPiece"); //addNewRequestPage.fillWorkflowDetails(requestType)
      //console.log("Workflow field value: " + addNewRequestPage.requestWorkflwdetails.workflow);
      expect(addNewRequestPage.requestWorkflwdetails.workflow).toMatch("NewPiece");
      expect(addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
      console.log("DWS:"+newRequest_data.basicDetails.DWStraffic_manager);
      await addNewRequestPage.fillBasicDetails(newRequest_data.basicDetails.projectName,newRequest_data.basicDetails.author,newRequest_data.basicDetails.traffic_manager,newRequest_data.basicDetails.CRCcode,newRequest_data.basicDetails.project_owner,newRequest_data.basicDetails.DWStraffic_manager);
      await browser.wait(EC.elementToBeClickable(addNewRequestPage.contentupdateAccordion),10000,'Content update arrow not clickable');
      //await addNewRequestPage.contentUpdate.click();
      await addNewRequestPage.contentupdateAccordion.click();
      browser.executeScript('window.scrollTo(0,10000);');
      await addNewRequestPage.fillContentUpdate();
      await browser.wait(EC.elementToBeClickable(addNewRequestPage.designPanel),10000,'Design panel arrow not clickable');
      await addNewRequestPage.designPanel.click();
      browser.executeScript('window.scrollTo(0,9000);');
      await addNewRequestPage.fillDesignDetails(newRequest_data.designDetails.fulfillmentInventoryCode);
      
      //select file to upload
      var absolutePath = path.resolve(__dirname,newRequest_data.fileToUpload);
      await addNewRequestPage.upldWorkflowFile.sendKeys(absolutePath);
      console.log("Uploaded file: "+ await addNewRequestPage.uploadedfilename.getText());
      expect(await addNewRequestPage.uploadedfilename.getText()).toMatch("\s*test.pptx\s*");
      browser.sleep(10000);
      browser.executeScript('window.scrollTo(0,9000);');
      await addNewRequestPage.submitRequest();
      await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
      await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
       //await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
    
      await browser.sleep(10000);
   });
   describe("EVS Design Without QC DWS Design Manager Rejection",function(){
    beforeEach(async function(){
        await dashBoardPage.logoutFromApplication();
        await browser.wait(EC.visibilityOf(loginPage.userName),10000,'Login screen not loaded');
    })
    it('Request assinged to author for review ',async function(){
        await browser.waitForAngularEnabled(false);
        //console.log("Traffic Manager  login: "+ configData.TrafficManager_username);
        await loginPage.loginToPortal(configData.Author_username,configData.Author_password);
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
        browser.executeScript('window.scrollTo(0,10000);');
         //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
        //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
        //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Author Review");
        var result=await dashBoardPage.myTasksall.filter(function(cell){
            return cell.getText().then(function(title){
                //console.log("title: " + title);
                //return title == "Test Projecttg3h";
                return title == addNewRequestPage.requestWorkflwdetails.projectName;
            });
        });
        console.log("Count :"+ result.length);
        expect(result.length).toEqual(1);
        await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
        //await dashBoardPage.clickonProjectinMyTasks("Test Projecttg3h");
        await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
        expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
        browser.executeScript('window.scrollTo(0,10000);');
        //------Upload workflow file
        await addNewRequestPage.uploadDocumentsAccordian.click();
        await browser.sleep(7000);
       var absolutePath = path.resolve(__dirname,newRequest_data.fileToUpload);
       await browser.wait(EC.presenceOf(addNewRequestPage.upldWorkflowFile),10000,'upldWorkflowFile not visible');
       await addNewRequestPage.upldWorkflowFile.sendKeys(absolutePath);
       var filecountbefore=await addNewRequestPage.uploadedallfiles.count();
       browser.executeScript('window.scrollTo(0,10000);');
       //console.log("Uploaded file: "+ await addNewRequestPage.uploadedfilename.getText());
       expect(await addNewRequestPage.uploadedfilename.getText()).toMatch("\s*test.pptx\s*");
       await browser.wait(EC.elementToBeClickable(addNewRequestPage.uploadButton),10000,'uploadButton not clickable');
       await addNewRequestPage.uploadButton.click();
       browser.sleep(7000);
       browser.executeScript('window.scrollTo(0,10000);');
       var filecountafter=await addNewRequestPage.uploadedallfiles.count();
       //console.log("file count: " + await addNewRequestPage.uploadedallfiles.count());
       expect(filecountafter).toEqual(filecountbefore+1);
       await addNewRequestPage.addCommentsinRequest("Author reviewed");
       await addNewRequestPage.submitRequest();
       await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
       await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
       await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
       await browser.sleep(10000);
    })
    it('Request assigned to Traffic Manager to select CU Manager ',async function(){
        await browser.waitForAngularEnabled(false);
        console.log("Traffic Manager  login: "+ configData.TrafficManager_username);
        await loginPage.loginToPortal(configData.TrafficManager_username,configData.TrafficManager_password);
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
        browser.executeScript('window.scrollTo(0,10000);');
       //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
        //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
        //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Traffic Manager");
        var result=await dashBoardPage.myTasksall.filter(function(cell){
            return cell.getText().then(function(title){
                //console.log("title: " + title);
                //return title == "Test Projecttg3h";
                return title == addNewRequestPage.requestWorkflwdetails.projectName;
            });
        });
        console.log("Count :"+ result.length);
        expect(result.length).toEqual(1);
        await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
        //await dashBoardPage.clickonProjectinMyTasks("Test Projecttg3h");
        await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
        expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
        browser.executeScript('window.scrollTo(0,10000);');
        /*await browser.wait(EC.elementToBeClickable(addNewRequestPage.designAccordian),10000,'designAccordian not clickable');
        await addNewRequestPage.designAccordian.click();
        await browser.wait(EC.elementToBeClickable(addNewRequestPage.projectAssign),10000,'projectAssign not clickable');
        await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.projectAssign,"In House");*/
        await addNewRequestPage.fillTaskDetails(newRequest_data.taskDetails.content_manager);
       
        //------Upload workflow file
        await addNewRequestPage.uploadDocumentsAccordian.click();
        await browser.sleep(7000);
       var absolutePath = path.resolve(__dirname,newRequest_data.fileToUpload);
       await browser.wait(EC.presenceOf(addNewRequestPage.upldWorkflowFile),10000,'upldWorkflowFile not visible');
       await addNewRequestPage.upldWorkflowFile.sendKeys(absolutePath);
       var filecountbefore=await addNewRequestPage.uploadedallfiles.count();
       browser.executeScript('window.scrollTo(0,10000);');
       //console.log("Uploaded file: "+ await addNewRequestPage.uploadedfilename.getText());
       expect(await addNewRequestPage.uploadedfilename.getText()).toMatch("\s*test.pptx\s*");
       await browser.wait(EC.elementToBeClickable(addNewRequestPage.uploadButton),10000,'uploadButton not clickable');
       await addNewRequestPage.uploadButton.click();
       browser.sleep(7000);
       browser.executeScript('window.scrollTo(0,10000);');
       var filecountafter=await addNewRequestPage.uploadedallfiles.count();
       //console.log("file count: " + await addNewRequestPage.uploadedallfiles.count());
       expect(filecountafter).toEqual(filecountbefore+1);
       await addNewRequestPage.addCommentsinRequest("Traffic Manager assigned CU Manager");
       
       await addNewRequestPage.submitRequest();
        /*
       await browser.wait(EC.visibilityOf(addNewRequestPage.requestCreatedMsg),10000,'requestCreatedMsg alert not displayed');
       console.log("Request created successfull: "+ await addNewRequestPage.requestCreatedMsg.getText());*/
       await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
       await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
       await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
       await browser.sleep(10000);
        //await result.get(0).click();

    });
    it('Content Manager should be able to assign Content Analyst',async function(){
        await browser.waitForAngularEnabled(false);
        await loginPage.loginToPortal(configData.ContentManager_username,configData.ContentManager_password);
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
        browser.executeScript('window.scrollTo(0,10000);');
        //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
        //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
        //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Content Update");
        var result=await dashBoardPage.myTasksall.filter(function(cell){
            return cell.getText().then(function(title){
                //console.log("title: " + title);
                //return title == "Test Projecttg3h";
                return title == addNewRequestPage.requestWorkflwdetails.projectName;
            });
        });
        console.log("Count :"+ result.length);
        expect(result.length).toEqual(1);
        await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
        //await dashBoardPage.clickonProjectinMyTasks("Test Projecttg3h");
        await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
        expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
        browser.executeScript('window.scrollTo(0,10000);');
        await browser.wait(EC.elementToBeClickable(addNewRequestPage.allocationAnalyst),10000,'allocationAnalyst not clickable');
        //await addNewRequestPage.allocationAnalyst.click();
        await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.allocationAnalyst,newRequest_data.taskDetails.content_analyst);
        await browser.sleep(10000);
        await addNewRequestPage.addCommentsinRequest("CU Manager assigned content Analyst");
        
        await addNewRequestPage.submitRequest();
        
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
        //await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
        //await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
        browser.sleep(10000);
    })
    it('Content Analyst uploads and submit',async function(){
        await browser.waitForAngularEnabled(false);
        await loginPage.loginToPortal(configData.ContentAnalyst_username,configData.ContentAnalyst_password);
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
        //await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
        //await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
        browser.executeScript('window.scrollTo(0,10000);');
        //Design fields are mandatory.It is already filled in this flow when we raised new request
       //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
        //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
        //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Content Update");
        
        var result=await dashBoardPage.myTasksall.filter(function(cell){
            return cell.getText().then(function(title){
                //console.log("title: " + title);
                //return title == "Test Projecttg3h";
                return title == addNewRequestPage.requestWorkflwdetails.projectName;
            });
        });
        console.log("Count :"+ result.length);
        expect(result.length).toEqual(1);
        await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
        //await dashBoardPage.clickonProjectinMyTasks("Test Projecttg3h");
        await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
        expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
        browser.executeScript('window.scrollTo(0,10000);');
        await addNewRequestPage.addCommentsinRequest("Content Analyst updated work");
        await addNewRequestPage.submitRequest();
        
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
        //await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
        //await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
        await browser.sleep(7000);
    })
    
    it('DWS Traffic Manager selects EVS design and assigns EVS Team manager',async function(){
        await browser.waitForAngularEnabled(false);
        await loginPage.loginToPortal(configData.DWSTrafficManager_username,configData.DWSTrafficManager_password);
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
        browser.executeScript('window.scrollTo(0,10000);');
       
        //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
        //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
        //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Traffic Manager");
        var result=await dashBoardPage.myTasksall.filter(function(cell){
            return cell.getText().then(function(title){
                //console.log("title: " + title);
                //return title == "Test ProjectxWPA";
                return title == addNewRequestPage.requestWorkflwdetails.projectName;
            });
        });
        console.log("Count :"+ result.length);
        expect(result.length).toEqual(1);
        await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
        //await dashBoardPage.clickonProjectinMyTasks("Test ProjectxWPA");
        await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
        expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
        expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
        
        await browser.wait(EC.elementToBeClickable(addNewRequestPage.projectAssign),10000,'projectAssign not clickable');
        await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.projectAssign,"Evs Design Team");
        await browser.executeScript('window.scrollTo(0,10000);');
        await browser.wait(EC.elementToBeClickable(addNewRequestPage.groupDropDown),10000,'groupDropDown not clickable');
        await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.groupDropDown,"Design Team Manager");
        await browser.wait(EC.elementToBeClickable(addNewRequestPage.roleDropDown),10000,'roleDropDown not clickable');
        await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.roleDropDown,"DWS Design Manager");
        await browser.wait(EC.elementToBeClickable(addNewRequestPage.teamManagerDropdown),10000,'teamManagerDropdown not clickable');
        await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.teamManagerDropdown,"All Role User");
        await browser.sleep(7000);
        browser.executeScript('window.scrollTo(0,10000);');
        await addNewRequestPage.addCommentsinRequest("DWS Traffic Manager assigned EVS Design Manager");
        await addNewRequestPage.submitRequest();
        browser.sleep(7000);
        })

        it('EVS Design Manager uploads document',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.EVSDesignManager_username,configData.EVSDesignManager_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //Design fields are mandatory.It is already filled in this flow when we raised new request
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("EVS Design Manager");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                    //return title == "Test ProjectxWPA";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
            await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.clickonProjectinMyTasks("Test ProjectxWPA");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            browser.executeScript('window.scrollTo(0,10000);');
            //------Upload workflow file
            await addNewRequestPage.uploadDocumentsAccordian.click();
            await browser.sleep(7000);
            var absolutePath = path.resolve(__dirname,newRequest_data.fileToUpload);
            await browser.wait(EC.presenceOf(addNewRequestPage.upldWorkflowFile),10000,'upldWorkflowFile not visible');
             await addNewRequestPage.upldWorkflowFile.sendKeys(absolutePath);
            var filecountbefore=await addNewRequestPage.uploadedallfiles.count();
             browser.executeScript('window.scrollTo(0,10000);');
            //console.log("Uploaded file: "+ await addNewRequestPage.uploadedfilename.getText());
            expect(await addNewRequestPage.uploadedfilename.getText()).toMatch("\s*test.pptx\s*");
             await browser.wait(EC.elementToBeClickable(addNewRequestPage.uploadButton),10000,'uploadButton not clickable');
            await addNewRequestPage.uploadButton.click();
            browser.sleep(7000);
            browser.executeScript('window.scrollTo(0,10000);');
            var filecountafter=await addNewRequestPage.uploadedallfiles.count();
            //console.log("file count: " + await addNewRequestPage.uploadedallfiles.count());
            expect(filecountafter).toEqual(filecountbefore+1);
            await addNewRequestPage.addCommentsinRequest("EVS Design Manager uploads and submitted request");
            await addNewRequestPage.submitRequest();
            browser.sleep(7000);
        })

        it('DWS Traffic Manager assigns DWS design Manager',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.DWSTrafficManager_username,configData.DWSTrafficManager_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //Design fields are mandatory.It is already filled in this flow when we raised new request
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Traffic Manager");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                    //return title == "Test ProjectxWPA";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
            await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.clickonProjectinMyTasks("Test ProjectxWPA");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.groupDropDown),10000,'groupDropDown not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.groupDropDown,"Design Team Manager");
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.roleDropDown),10000,'roleDropDown not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.roleDropDown,"DWS Design Manager");
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.teamManagerDropdown),10000,'teamManagerDropdown not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.teamManagerDropdown,"Design Manager");
            await browser.sleep(7000);
            browser.executeScript('window.scrollTo(0,10000);');
            await addNewRequestPage.addCommentsinRequest("DWS Traffic Manager assigned Dws Design Manager");
            await addNewRequestPage.submitRequest();
            browser.sleep(7000);
        })
        it('DWS Design Manager reject request',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.DWSManager_username,configData.DWSManager_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //Design fields are mandatory.It is already filled in this flow when we raised new request
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("DWS Design Manager");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                    //return title == "Test NewPiece RqstxsFK";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
            await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.clickonProjectinMyTasks("Test NewPiece RqstxsFK");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            //browser.executeScript('window.scrollTo(0,10000);');
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.designManagerApproval),10000,'projectOwnerApproval not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.designManagerApproval,"Need Edits");
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.rejectionComments),10000,'rejectionComments not clickable');
            await addNewRequestPage.rejectionComments.sendKeys("Rejected by DWS design manager");
            browser.executeScript('window.scrollTo(0,10000);');
            await addNewRequestPage.addCommentsinRequest("DWS Design Manager rejected request");
            await addNewRequestPage.submitRequest();
            browser.sleep(7000);
        })
        it('EVS Design Manager uploads document after rejection',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.EVSDesignManager_username,configData.EVSDesignManager_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //Design fields are mandatory.It is already filled in this flow when we raised new request
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("EVS Design Manager");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                   // return title == "Test NewPiece RqstxsFK";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
            await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
           // await dashBoardPage.clickonProjectinMyTasks("Test NewPiece RqstxsFK");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            browser.executeScript('window.scrollTo(0,10000);');
            //------Upload workflow file
            await addNewRequestPage.uploadDocumentsAccordian.click();
            await browser.sleep(7000);
            var absolutePath = path.resolve(__dirname,newRequest_data.fileToUpload);
            await browser.wait(EC.presenceOf(addNewRequestPage.upldWorkflowFile),10000,'upldWorkflowFile not visible');
             await addNewRequestPage.upldWorkflowFile.sendKeys(absolutePath);
            var filecountbefore=await addNewRequestPage.uploadedallfiles.count();
             browser.executeScript('window.scrollTo(0,10000);');
            //console.log("Uploaded file: "+ await addNewRequestPage.uploadedfilename.getText());
            expect(await addNewRequestPage.uploadedfilename.getText()).toMatch("\s*test.pptx\s*");
             await browser.wait(EC.elementToBeClickable(addNewRequestPage.uploadButton),10000,'uploadButton not clickable');
            await addNewRequestPage.uploadButton.click();
            browser.sleep(7000);
            browser.executeScript('window.scrollTo(0,10000);');
            var filecountafter=await addNewRequestPage.uploadedallfiles.count();
            //console.log("file count: " + await addNewRequestPage.uploadedallfiles.count());
            expect(filecountafter).toEqual(filecountbefore+1);
            await addNewRequestPage.addCommentsinRequest("EVS Design Manager uploads after rejection ");
            await addNewRequestPage.submitRequest();
            browser.sleep(7000);
        })
        it('After rejection DWS Traffic Manager assigns DWS design Manager',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.DWSTrafficManager_username,configData.DWSTrafficManager_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //Design fields are mandatory.It is already filled in this flow when we raised new request
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Traffic Manager");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                    //return title == "Test NewPiece RqstxsFK";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
            await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.clickonProjectinMyTasks("Test NewPiece RqstxsFK");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.groupDropDown),10000,'groupDropDown not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.groupDropDown,"Design Team Manager");
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.roleDropDown),10000,'roleDropDown not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.roleDropDown,"DWS Design Manager");
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.teamManagerDropdown),10000,'teamManagerDropdown not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.teamManagerDropdown,"Design Manager");
            await browser.sleep(7000);
            browser.executeScript('window.scrollTo(0,10000);');
            await addNewRequestPage.addCommentsinRequest("after rejection DWS Traffic Manager assigned Dws DM");
            await addNewRequestPage.submitRequest();
            browser.sleep(7000);
        })
        it('DWS Design Manager Approves request',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.DWSManager_username,configData.DWSManager_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //Design fields are mandatory.It is already filled in this flow when we raised new request
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("DWS Design Manager");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                    //return title == "Test NewPiece RqstxsFK";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
            await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.clickonProjectinMyTasks("Test NewPiece RqstxsFK");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            //browser.executeScript('window.scrollTo(0,10000);');
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.designManagerApproval),10000,'projectOwnerApproval not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.designManagerApproval,"Approve");
            browser.executeScript('window.scrollTo(0,10000);');
            await addNewRequestPage.addCommentsinRequest("DWS Design Manager approved request");
            await addNewRequestPage.submitRequest();
            browser.sleep(7000);
        })
        it('Project Owner Approves request',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.ProjectOwner_username,configData.ProjectOwner_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //Design fields are mandatory.It is already filled in this flow when we raised new request
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Project Owner");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                    //return title == "Test NewPiece RqstxsFK";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
            await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.clickonProjectinMyTasks("Test NewPiece RqstxsFK");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            browser.executeScript('window.scrollTo(0,10000);'); 
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.projectOwnerApproval),10000,'projectOwnerApproval not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.projectOwnerApproval,"Approve");
            await addNewRequestPage.addCommentsinRequest("Project Owner Approved");
            await addNewRequestPage.submitRequest();
            browser.sleep(7000);  
        })
        it('DWS Design Manager final approval on request',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.DWSManager_username,configData.DWSManager_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //Design fields are mandatory.It is already filled in this flow when we raised new request
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("DWS Design Manager");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                    //return title == "Test NewPiece RqstxsFK";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
            await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.clickonProjectinMyTasks("Test NewPiece RqstxsFK");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            //browser.executeScript('window.scrollTo(0,10000);');
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.designManagerApproval),10000,'projectOwnerApproval not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.designManagerApproval,"Approve");
            browser.executeScript('window.scrollTo(0,10000);');
            await addNewRequestPage.addCommentsinRequest("DWS Design Manager approved request");
            await addNewRequestPage.submitRequest();
            browser.sleep(7000);
        })
        it('EVS design manager uploads document',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.EVSDesignManager_username,configData.EVSDesignManager_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //Design fields are mandatory.It is already filled in this flow when we raised new request
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Digital");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                    //return title == "Test NewPiece RqstxsFK";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
            await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.clickonProjectinMyTasks("Test NewPiece RqstxsFK");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            browser.executeScript('window.scrollTo(0,10000);');
              //------Upload workflow file
            await addNewRequestPage.uploadDocumentsAccordian.click();
            await browser.sleep(7000);
            var absolutePath = path.resolve(__dirname,newRequest_data.fileToUpload);
            await browser.wait(EC.presenceOf(addNewRequestPage.upldWorkflowFile),10000,'upldWorkflowFile not visible');
             await addNewRequestPage.upldWorkflowFile.sendKeys(absolutePath);
            var filecountbefore=await addNewRequestPage.uploadedallfiles.count();
             browser.executeScript('window.scrollTo(0,10000);');
            //console.log("Uploaded file: "+ await addNewRequestPage.uploadedfilename.getText());
            expect(await addNewRequestPage.uploadedfilename.getText()).toMatch("\s*test.pptx\s*");
             await browser.wait(EC.elementToBeClickable(addNewRequestPage.uploadButton),10000,'uploadButton not clickable');
            await addNewRequestPage.uploadButton.click();
            browser.sleep(7000);
            browser.executeScript('window.scrollTo(0,10000);');
            var filecountafter=await addNewRequestPage.uploadedallfiles.count();
            //console.log("file count: " + await addNewRequestPage.uploadedallfiles.count());
            expect(filecountafter).toEqual(filecountbefore+1);
            await addNewRequestPage.addCommentsinRequest("Digital analyst uploads and submitted request");
            await addNewRequestPage.submitRequest();
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            //await browser.wait(EC.elementToBeClickable(dashBoardPage.latestProjectTab),10000,"latestProjectTab is not clickable");
            //await dashBoardPage.latestProjectTab.click();
            // status should be completed

            browser.sleep(7000);
        })
        it('Project Owner reviews request',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.ProjectOwner_username,configData.ProjectOwner_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //Design fields are mandatory.It is already filled in this flow when we raised new request
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Project Owner");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                    //return title == "Test NewPiece RqstxsFK";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
            await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.clickonProjectinMyTasks("Test NewPiece RqstxsFK");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            browser.executeScript('window.scrollTo(0,10000);'); 
            await addNewRequestPage.addCommentsinRequest("Project Owner reviewed");
            await addNewRequestPage.submitRequest();
            browser.sleep(7000);  
        })
        
        it('Traffic Manager assigns Compliance Manager Download',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.TrafficManager_username,configData.TrafficManager_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Traffic Manager");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                   // return title == "Test NewPiece RqstxsFK";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
            await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.clickonProjectinMyTasks("Test NewPiece RqstxsFK");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            browser.executeScript('window.scrollTo(0,10000);');
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.groupDropDown),10000,'groupDropDown not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.groupDropDown,"Compliance Reviewer");
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.roleDropDown),10000,'roleDropDown not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.roleDropDown,"DWS Compliance Reviewer");
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.teamManagerDropdown),10000,'teamManagerDropdown not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.teamManagerDropdown,newRequest_data.taskDetails.compliance_manager);
            await addNewRequestPage.addCommentsinRequest("Traffic Manager assigned compliance Manager");
            await addNewRequestPage.submitRequest();
            //verify file downloaded
            browser.sleep(7000);
        })
        
        it('Compliance Manager approve request',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.Compliance_username,configData.Compliance_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //Design fields are mandatory.It is already filled in this flow when we raised new request
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Compliance");
             //expect(await dashBoardPage.myTasksState.getText()).toMatch("Compliance Review");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                    //return title == "Test NewPiece RqstxsFK";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
            await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.clickonProjectinMyTasks("Test NewPiece RqstxsFK");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            browser.executeScript('window.scrollTo(0,10000);');
                     
            await browser.actions().mouseMove(await addNewRequestPage.alpsCompleted).click().perform();
            await browser.actions().mouseMove(await addNewRequestPage.mrgCompleted).click().perform();
                    
            await browser.actions().mouseMove(await addNewRequestPage.rpCompleted).click().perform();
            
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.complianceApprove,"Approve");
            await addNewRequestPage.addCommentsinRequest("Compliance Manager approved request ");
            await addNewRequestPage.submitRequest();
            browser.sleep(7000);
        })
        it('Digital Manager claims request',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.DigitalManager_username,configData.DigitalManager_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //console.log("Tool tip: "+ await dashBoardPage.myprojectclaim.getAttribute("tooltip"));
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Task available for claim");
            await dashBoardPage.claimRequestByName(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.claimRequestByName("Test NewPiece RqstxsFK");
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.submitdialogueYesbtn),10000,'submitdialogueYesbtn not clickable');
            await addNewRequestPage.submitdialogueYesbtn.click();
            await browser.wait(EC.visibilityOf(addNewRequestPage.requestCreatedMsg),10000,'requestCreatedMsg alert not displayed');
            console.log("Request claimed successfull: "+ await addNewRequestPage.requestCreatedMsg.getText());
            expect(addNewRequestPage.requestCreatedMsg.getText()).toMatch("Task Claimed Successfully");
            browser.sleep(7000);
        })
        it('Digital Manager assigns digital analyst',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.DigitalManager_username,configData.DigitalManager_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //Design fields are mandatory.It is already filled in this flow when we raised new request
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Digital");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                  // return title == "Test NewPiece RqstxsFK";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
            await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.clickonProjectinMyTasks("Test NewPiece RqstxsFK");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            browser.executeScript('window.scrollTo(0,10000);');
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.digitalAnalyst),10000,'projectAssign not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.digitalAnalyst,newRequest_data.taskDetails.digital_analyst);
            await addNewRequestPage.addCommentsinRequest("Digital Manager assigns digital analyst"); 
            await addNewRequestPage.submitRequest();
            browser.sleep(7000);
        })
        it('Digital Analyst uploads document',async function(){
            await browser.waitForAngularEnabled(false);
            await loginPage.loginToPortal(configData.DigitalAnalyst_username,configData.DigitalAnalyst_password);
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            browser.executeScript('window.scrollTo(0,10000);');
            //Design fields are mandatory.It is already filled in this flow when we raised new request
            //console.log("Tasks status:" + await dashBoardPage.myTasksStatus.getText());
            //console.log("new project Name:" + await addNewRequestPage.requestWorkflwdetails.projectName);
            //expect(await dashBoardPage.myTasksStatus.getText()).toMatch("Digital");
            var result=await dashBoardPage.myTasksall.filter(function(cell){
                return cell.getText().then(function(title){
                    //console.log("title: " + title);
                    //return title == "Test NewPiece RqstxsFK";
                    return title == addNewRequestPage.requestWorkflwdetails.projectName;
                });
            });
            console.log("Count :"+ result.length);
            expect(result.length).toEqual(1);
             await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
            //await dashBoardPage.clickonProjectinMyTasks("Test NewPiece RqstxsFK");
            await browser.wait(EC.visibilityOf(await addNewRequestPage.workflowDetailsPanel),15000,'workflowDetailsPanel not visible');
            expect(await addNewRequestPage.workflowDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.basicDetailsPanel.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.contentUpdateTitle.isDisplayed()).toBe(true);
            expect(await addNewRequestPage.designPanel.isDisplayed()).toBe(true);
            browser.executeScript('window.scrollTo(0,10000);');
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.digitalAccordian),10000,'digitalAccordian not clickable');
            await addNewRequestPage.digitalAccordian.click();
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.seismicStatus),10000,'seismicStatus not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.seismicStatus,"Posted");
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.webStatus),10000,'webStatus not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.webStatus,"Posted");
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.designStatus),10000,'designStatus not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(addNewRequestPage.designStatus,"Posted");
            browser.executeScript('window.scrollTo(0,10000);');
            //------Upload workflow file
            await addNewRequestPage.uploadDocumentsAccordian.click();
            await browser.sleep(7000);
            var absolutePath = path.resolve(__dirname,newRequest_data.fileToUpload);
            await browser.wait(EC.presenceOf(addNewRequestPage.upldWorkflowFile),10000,'upldWorkflowFile not visible');
             await addNewRequestPage.upldWorkflowFile.sendKeys(absolutePath);
            var filecountbefore=await addNewRequestPage.uploadedallfiles.count();
             browser.executeScript('window.scrollTo(0,10000);');
            //console.log("Uploaded file: "+ await addNewRequestPage.uploadedfilename.getText());
            expect(await addNewRequestPage.uploadedfilename.getText()).toMatch("\s*test.pptx\s*");
             await browser.wait(EC.elementToBeClickable(addNewRequestPage.uploadButton),10000,'uploadButton not clickable');
            await addNewRequestPage.uploadButton.click();
            browser.sleep(7000);
            browser.executeScript('window.scrollTo(0,10000);');
            var filecountafter=await addNewRequestPage.uploadedallfiles.count();
            //console.log("file count: " + await addNewRequestPage.uploadedallfiles.count());
            expect(filecountafter).toEqual(filecountbefore+1);
            await addNewRequestPage.addCommentsinRequest("Digital analyst uploads and submitted request");
            await addNewRequestPage.submitRequest();
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            //await browser.wait(EC.elementToBeClickable(dashBoardPage.latestProjectTab),10000,"latestProjectTab is not clickable");
            //await dashBoardPage.latestProjectTab.click();
            // status should be completed

            browser.sleep(7000);
        })

      })
      
       xit('my tasks should display created request',async function(){
    /*var result = activeProjectsPage.projtitleall.filter(function(project){
          
        return project.element(activeProjectsPage.projectnm.locator()).getText().then(function(title){
            //console.log(title);
            return title == createNewProjectPage.newprojectname;
            //return title == "content clonned_vkdJ";
        });
        });
        //console.log("projects count"+ await result.count());
        expect(await result.count()).toEqual(0);*/
        await browser.sleep(7000);
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
        console.log("rows count: " + await dashBoardPage.myTasksallRows.count());
        //console.log("title: " + await addNewRequestPage.myTasks.first().getText());
        //console.log("title: " + await addNewRequestPage.myTasks.count());
        /*var result=await addNewRequestPage.myTasks.filter(function(cell){
            
            return cell.getText().then(function(title){
                console.log("title: " + title);
                return title == "Test Project";
            });
        });

        console.log("Count :"+ result.length);*/

        var result=await dashBoardPage.myTasksall.filter(function(row,index){
            return row.element(addNewRequestPage.myTasksprojname.locator()).getText().then(function(title){
                console.log("title: " + title);
                if(title == "Test Project")
                return index ;
            });
        });
        console.log("Index: "+ result);

   })
})