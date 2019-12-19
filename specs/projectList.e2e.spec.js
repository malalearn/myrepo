var configData=require('..\\test_data\\config_data.json');
var commonFunctions=require('..\\lib\\commonFunctions');
var newRequest_data=require('..\\test_data\\newRequest_data.json');
var loginPage=require('..\\page_objects\\login_PO.js');
var dashBoardPage=require('..\\page_objects\\homePage_PO.js');
var addNewRequestPage=require('..\\page_objects\\addNewRequest_PO.js');
var projectListPage=require('..\\page_objects\\projectList_PO.js');
describe('Project List ',function(){
    var EC =protractor.ExpectedConditions;
    var path = require('path');
    beforeAll(async function(){
        loginPage.navigateToPortal(configData.loginurl.QA);
        await browser.waitForAngularEnabled(false);
        //console.log("Requestor login: "+ configData.Requestor_username);
        loginPage.loginToPortal(configData.Author_username,configData.Author_password);
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
       /* //-----------create new Request of type New Piece----------------------------------
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
        await addNewRequestPage.fillBasicDetails(newRequest_data.basicDetails.projectName,newRequest_data.basicDetails.author,newRequest_data.basicDetails.traffic_manager,newRequest_data.basicDetails.CRCcode,newRequest_data.basicDetails.project_owner,newRequest_data.basicDetails.project_owner,newRequest_data.basicDetails.DWStraffic_manager);
         console.log("Project Name: "+ addNewRequestPage.requestWorkflwdetails.projectName);
        await browser.wait(EC.elementToBeClickable(addNewRequestPage.contentupdateAccordion),10000,'Content update arrow not clickable');
        //await addNewRequestPage.contentUpdate.click();
        await addNewRequestPage.contentupdateAccordion.click();
        await addNewRequestPage.fillContentUpdate();
        await browser.wait(EC.elementToBeClickable(addNewRequestPage.designPanel),10000,'Design panel arrow not clickable');
        await addNewRequestPage.designPanel.click();
        await addNewRequestPage.fillDesignDetails(newRequest_data.designDetails.fulfillmentInventoryCode);
        browser.executeScript('window.scrollTo(0,10000);');
        //select file to upload
        var absolutePath = path.resolve(__dirname,newRequest_data.fileToUpload);
        await addNewRequestPage.upldWorkflowFile.sendKeys(absolutePath);
        console.log("Uploaded file: "+ await addNewRequestPage.uploadedfilename.getText());
        expect(await addNewRequestPage.uploadedfilename.getText()).toMatch("\s*test.pptx\s*");
        await addNewRequestPage.submitRequest();
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
        await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
        await browser.sleep(7000);
        //await addNewRequestPage.requestCreatedMsg.getText();*/
        await browser.sleep(10000); 
    })
    afterAll(async function(){
        dashBoardPage.logoutFromApplication();
        await browser.wait(EC.visibilityOf(loginPage.userName),10000,'Login screen not loaded');
    });
    fit('should be able to navigate to Project List',async function(){
        await dashBoardPage.navigateToProjectList();
        browser.sleep(5000);
        await browser.wait(EC.visibilityOf(projectListPage.filterPanel),10000,'Filter Panel not loaded');
        expect(projectListPage.filterPanel.isDisplayed()).toBe(true);
    })
    fit('should be able to filter projects by date range and Request type',async function(){
        await projectListPage.selectPastDate();
        await browser.wait(EC.elementToBeClickable(projectListPage.requestType),10000,'requestType not clickable');
        await projectListPage.requestType.click();
        await projectListPage.selectRequestType("New Piece");
        // browser.sleep(3000);
        await browser.wait(EC.elementToBeClickable(projectListPage.requestType),10000,'requestType not clickable');
        await projectListPage.requestType.click();
        browser.sleep(3000);
        await browser.wait(EC.elementToBeClickable(projectListPage.applyFilter),10000,'applyFilter not clickable');
        await projectListPage.applyFilter.click();
        await browser.wait(EC.visibilityOf(projectListPage.filterDataTable),10000,'filterDataTable not displayed');
        expect(projectListPage.filterDataTable.isDisplayed()).toBe(true);
        //console.log("total:"+ await projectListPage.allRequestTypesinGrid.count());
        browser.sleep(7000);
    })
    it('should be able to update priority of request from filtered results',async function(){
        await projectListPage.updatePriority("Test NewPiece RqstU3jb");
        await browser.wait(EC.visibilityOf(projectListPage.updatePrioritydialoguePL),10000,"updatePrioritydialoguePL not displayed");
        //console.log("options:"+ await projectListPage.updatePriorityDropdown.$$("option[value]").count());
        await projectListPage.selectPriority();
        //console.log("submited priority:"+ projectListPage.priorityoptionselected);
        var updatedprioritybefore = await projectListPage.priorityoptionselected;
        await browser.wait(EC.elementToBeClickable(projectListPage.submitbtn),10000,"submitbtn not displayed");
        await projectListPage.submitbtn.click();
        await browser.wait(EC.visibilityOf(projectListPage.submittedmsg),10000,"submittedmsg not displayed");
        expect(projectListPage.submittedmsg.getText()).toEqual("Priority has been updated successfully");
        await browser.wait(EC.invisibilityOf(projectListPage.submittedmsg),10000,"submittedmsg not disappeared");
        await browser.wait(EC.visibilityOf(projectListPage.filterDataTable),10000,"filterDataTable not displayed");
        browser.sleep(4000);
        await projectListPage.updatePriority("Test NewPiece RqstU3jb");
        await browser.wait(EC.visibilityOf(projectListPage.updatePrioritydialoguePL),10000,"updatePrioritydialoguePL not displayed");
         //console.log("selected priority:"+ await projectListPage.updatePriorityDropdown.$('option:checked').getText());
        var updatedpriorityafter=await projectListPage.updatePriorityDropdown.$('option:checked').getText();
        expect(updatedpriorityafter).toContain(updatedprioritybefore);
        await projectListPage.closebtn.click();
        browser.sleep(7000);
    })
    describe('actions on filtered result',function(){
        beforeEach(async function(){
            console.log("In before each");
            browser.executeScript('window.scrollTo(0,0);');
            browser.sleep(7000);
            await browser.wait(EC.elementToBeClickable(dashBoardPage.logo),10000,'logo not clickable');
            await dashBoardPage.logo.click();
            browser.sleep(5000);
            await dashBoardPage.navigateToProjectList();
            browser.sleep(5000);
            await browser.wait(EC.visibilityOf(projectListPage.filterPanel),10000,'Filter Panel not loaded');
            expect(projectListPage.filterPanel.isDisplayed()).toBe(true);
            //----------filter requests
            await projectListPage.selectPastDate();
            await browser.wait(EC.elementToBeClickable(projectListPage.requestType),10000,'requestType not clickable');
            await projectListPage.requestType.click();
            await projectListPage.selectRequestType("New Piece");
            // browser.sleep(3000);
            await browser.wait(EC.elementToBeClickable(projectListPage.requestType),10000,'requestType not clickable');
            await projectListPage.requestType.click();
            browser.sleep(3000);
            await browser.wait(EC.elementToBeClickable(projectListPage.applyFilter),10000,'applyFilter not clickable');
            await projectListPage.applyFilter.click();
            await browser.wait(EC.visibilityOf(projectListPage.filterDataTable),10000,'filterDataTable not displayed');
            expect(projectListPage.filterDataTable.isDisplayed()).toBe(true);
            //console.log("total:"+ await projectListPage.allRequestTypesinGrid.count());
            browser.sleep(7000);
         })
         afterEach(async function(){
             await browser.wait(EC.elementToBeClickable(dashBoardPage.logo),10000,'logo not clickable');
             await dashBoardPage.logo.click();
             await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,"my Tasks not displayed");
         })
        it('should be able to copy New piece request from filtered results ',async function(){
            //browser.sleep(7000);
            browser.executeScript('window.scrollTo(0,9000);');
            projectListPage.copyRequest("Test ProjectxWPA");
            await browser.wait(EC.elementToBeClickable(await addNewRequestPage.projectName),10000,'projectName not clickable');
            var newp ="Test ProjectbvEu" 
            conc = newp.concat(" copy");
            //string = name.concat(string);
            console.log("new project:" + conc);
            addNewRequestPage.projectName.sendKeys(conc);
             
            browser.sleep(5000);
            await browser.wait(EC.elementToBeClickable(await addNewRequestPage.projectOwner),10000,'projectOwner not clickable');
            await commonFunctions.selectdropdownOptionByVisibleText(await addNewRequestPage.projectOwner,newRequest_data.basicDetails.project_owner); 
            browser.sleep(5000);
            await browser.executeScript('window.scrollTo(0,9000);');
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.designAccordian),10000,'designAccordian not clickable');
            await addNewRequestPage.designAccordian.click();
            browser.executeScript('window.scrollTo(0,10000);');
            await browser.wait(EC.elementToBeClickable(addNewRequestPage.updateCycleFrequency),10000,'updateCycleFrequency not clickable');
            await commonFunctions.selectrandomdropdownOption(addNewRequestPage.updateCycleFrequency);
        
            //await browser.wait(EC.elementToBeClickable(addNewRequestPage.uploadAccordian),10000,'uploadAccordian not clickable');
            //await addNewRequestPage.uploadAccordian.click();
            //select file to upload
            var absolutePath = path.resolve(__dirname,newRequest_data.fileToUpload);
            await addNewRequestPage.upldWorkflowFile.sendKeys(absolutePath);
            console.log("Uploaded file: "+ await addNewRequestPage.uploadedfilename.getText());
            expect(await addNewRequestPage.uploadedfilename.getText()).toMatch("\s*test.pptx\s*");
            browser.sleep(4000);
            browser.executeScript('window.scrollTo(0,10000);');
            await addNewRequestPage.submitRequest();
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,'My tasks tab not loaded');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksgrid),15000,'My tasks grid not visible');
            await browser.wait(EC.visibilityOf(dashBoardPage.myTasksall.last()),15000,'My tasks grid not visible');
            //------check copied request displayed in project List
            //await dashBoardPage.logo.click();
            await dashBoardPage.navigateToProjectList();
            await browser.wait(EC.visibilityOf(projectListPage.filterPanel),10000,'Filter Panel not loaded');
            browser.sleep(4000);
            await projectListPage.selectPastDate();
            await browser.wait(EC.elementToBeClickable(projectListPage.requestType),10000,'requestType not clickable');
            await projectListPage.requestType.click();
            await projectListPage.selectRequestType("New Piece");
            // browser.sleep(3000);
            await browser.wait(EC.elementToBeClickable(projectListPage.requestType),10000,'requestType not clickable');
            await projectListPage.requestType.click();
            browser.sleep(3000);
            await browser.wait(EC.elementToBeClickable(projectListPage.applyFilter),10000,'applyFilter not clickable');
            await projectListPage.applyFilter.click();
            await browser.wait(EC.visibilityOf(projectListPage.filterDataTable),10000,'filterDataTable not displayed');
            expect(projectListPage.filterDataTable.isDisplayed()).toBe(true);
            //console.log("Request title: "+ await projectListPage.requestinTable.getText());
            expect(await projectListPage.requestinTable.getText()).toMatch(conc);
            browser.sleep(7000);
            })
               
            fit('manual initiate New Piece request as complete Update',async function(){
                //await projectListPage.initiateRequest("Test NewPiece RqstxsFK");
               /* await browser.wait(EC.elementToBeClickable(dashBoardPage.logo),10000,'logo not clickable');
                await dashBoardPage.logo.click();
                browser.sleep(7000);*/
                browser.executeScript('window.scrollTo(0,10000);');
                //await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,"my Tasks not displayed");
                
                await projectListPage.initiateRequest("Test NewPiece RqstT7qw");
                browser.sleep(7000);
                await browser.wait(EC.visibilityOf(await projectListPage.updatePrioritydialoguePL),10000,"Initiate Request dialogue not displayed");
                await browser.wait(EC.elementToBeClickable(await projectListPage.closebtn),10000,'closebtn not clickable');
                browser.sleep(7000);
                await projectListPage.closebtn.click();
                await projectListPage.initiateRequest("Test NewPiece RqstT7qw");
                await browser.wait(EC.elementToBeClickable(await projectListPage.requestypeInititateReqst),10000,'requestypeInititateReqst not clickable');
                //await browser.executeScript("arguments[0].click();",await projectListPage.requestypeInititateReqst);
                //await projectListPage.requestypeInititateReqst.click();
                var updatedprioritybefore = await projectListPage.priorityoptionselected;
                await commonFunctions.selectdropdownOptionByVisibleText(projectListPage.requestypeInititateReqst,"Complete Update");
                let priority=await commonFunctions.getunselecteddropdownvalue(projectListPage.updatePriorityDropdown);
                await priority.click();
                //await projectListPage.selectPriority();
                var updatedprioritybefore = await priority.getText();
                await browser.wait(EC.elementToBeClickable(await projectListPage.submitbtn),10000,'Submit button not clickable');
                await projectListPage.submitbtn.click();
                //await browser.wait(EC.visibilityOf(projectListPage.submittedmsg),10000,"submittedmsg not displayed");
                //await browser.wait(EC.invisibilityOf(projectListPage.submittedmsg),10000,"submittedmsg not disappeared");
                browser.sleep(7000);
                await browser.wait(EC.invisibilityOf(await projectListPage.updatePrioritydialoguePL),20000,"Initiate Request dialogue not disappeared");
                //-----check updated priority
                browser.sleep(7000);
                await browser.wait(EC.elementToBeClickable(dashBoardPage.logo),10000,'logo not clickable');
                await dashBoardPage.logo.click();
                browser.sleep(7000);
                await browser.wait(EC.visibilityOf(dashBoardPage.myTasks),10000,"my Tasks not displayed");
                browser.executeScript('window.scrollTo(0,10000);');
                //await dashBoardPage.clickonProjectinMyTasks(addNewRequestPage.requestWorkflwdetails.projectName);
                await dashBoardPage.clickonProjectinMyTasks("Test NewPiece RqstT7qw");
               /* await browser.wait(EC.visibilityOf(addNewRequestPage.workflwPrioritydropdown),10000,"submittedmsg not displayed");
                console.log("priority selected:"+await addNewRequestPage.workflwPrioritydropdown.$('option:checked').getText());
                var updatedpriorityafter=await addNewRequestPage.workflwPrioritydropdown.$('option:checked').getText();
                expect(updatedpriorityafter).toContain(updatedprioritybefore);*/
                
            })
    })
    

})