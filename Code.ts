// Compiled using ts2gas 3.6.4 (TypeScript 4.2.3)
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
//
function doGet(e) {
    var bookId = e.parameter.bookId;
    var transactionIds = e.parameter.transactionIds;
     var propertiesObj = checkProperties(bookId);
    
     Logger.log("api key "+ propertiesObj.doxeyApiKey);
    if (propertiesObj.msg == "") {
        if (transactionIds) {
            var htmlTemplate = HtmlService.createTemplateFromFile('Dialog');
            htmlTemplate.dataFromServerTemplate = { bookid: bookId, transactionIds: transactionIds, msg: propertiesObj.msg, templateUrl: propertiesObj.templateUrl, folderId: propertiesObj.folderId, doxeyApiKey: propertiesObj.doxeyApiKey };
            var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
                .setTitle('Receipt');
        }
        else {
            // No transactions selected
            var htmlTemplate = HtmlService.createTemplateFromFile('Dialog');
            var msg = "Please select some transaction(s) to put on the receipt.";
            htmlTemplate.dataFromServerTemplate = { bookid: bookId, transactionIds: transactionIds, msg: msg };
            var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
                .setTitle('Instructions');
        }
    }
    else {
        // No properties 
        var htmlTemplate = HtmlService.createTemplateFromFile('Dialog');
        htmlTemplate.dataFromServerTemplate = { bookid: bookId, transactionIds: transactionIds, msg: propertiesObj.msg, templateUrl: propertiesObj.templateUrl, folderId: propertiesObj.folderId };
        var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
            .setTitle('Instructions');
    }
    return htmlOutput;
}
function checkProperties(bookId) {
    var book = BkperApp.openById(bookId);
    var properties = book.getProperties();
    var msg = "";
    //Eeceipt template
    // Check content
    if (!properties.receipt_template_url) {
        Logger.log("no tmplate url");
        var templateUrl = "https://docs.google.com/document/d/1MMENpgkJu24RqHDtVvn9jEJRcEgBo_KtND123VFNTnk/edit";
    }
    else {
        var templateUrl = properties.receipt_template_url;
    }
    //Check for receipt_template
    var templateId = getIdFromUrl(templateUrl);
    try {
        DriveApp.getFileById(templateId);
    }
    catch (e) {
        msg = "Please check the book property receipt_template_url <br><br>" + e;
        Logger.log("no valid template url");
        //return {msg ,receipt_template_url}
    }

    //Doxey Api Key
    if (!properties.doxey_api_key) {
        var doxeyApiKey ="";
    } else {
        doxeyApiKey = properties.doxey_api_key;
    
        // check the license
        var  params = { 'apiKey': doxeyApiKey };
        var options = {
            'contentType': "application/json",
            'method': 'post',
            'payload': JSON.stringify(params),
            'muteHttpExceptions': false
        };
        try{
    
            UrlFetchApp.fetch('https://api.doxey.io/license', options);
        } catch (e){
           Logger.log(e)
        }
    }
    

    //Receipt folder 
    // Check content
    if (!properties.receipt_folder_url) {
        Logger.log("no folder url");
        msg = "Please set book property receipt_folder_url";
        return { msg, templateUrl };
    }
    // check existance/ access
    var folderId = getIdFromUrl(properties.receipt_folder_url);
    Logger.log("folder id: " + folderId);
    try {
        DriveApp.getFolderById(folderId);
    }
    catch (e) {
        msg = "Please check the book property receipt_folder_url <br><br>" + e;
        Logger.log("no valid receipt forlder url");
    }
    return { msg, templateUrl, folderId, doxeyApiKey };
}
function testCheckProperties() {
    var bookId = "agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAoITsoaMJDA";
    Logger.log(checkProperties(bookId));
}
// populate the Pop up in the book.
function initialize(bookId, transactionIds, msg, templateUrl, folderId, doxeyApiKey) {
    var book = BkperApp.openById(bookId);
    var model = generateModel(book, transactionIds);
    var object = merge(model, templateUrl, folderId, doxeyApiKey);
    var receiptUrl = object.receiptUrl;
    var receiptName = object.receiptName;
    return { bookId, transactionIds, receiptUrl, receiptName };
}
// Generation of the model for the receipt
function generateModel(book, transactionIds) {
    // Book Properties
    //var book = BkperApp.openById(bookId);
    var model = {
        book: __assign(__assign({}, book.getProperties()), { name: book.getName() })
    };
    // Account properties
    //var account = book.getAccount(customerName);
    //model.customer = __assign(__assign({}, account.getProperties()), { name: account.getName(), balance: account.getBalance() });
    //Logger.log( "account:'"+ customerName + "' after:" + afterDate + " before:"+beforeDate)
    // transactions
    const transactionIdsArray = transactionIds.split(" ");
    var total = 0 * 1;
    model.transactions = [];
    for (var i = 0; i < transactionIdsArray.length; i++) {
        let transactionId = transactionIdsArray[i];
        let transaction = book.getTransaction(transactionId);
        model.transactions.push({
            date: transaction.getInformedDateText(),
            description: transaction.getDescription(),
            account: transaction.getCreditAccount().getName(),
            amount: transaction.getAmount()
        });
        total += Number(transaction.getAmount());
    }
    //Receipt
    model.receipt = __assign({ total: total, date: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss') });
    return model;
}
// test the generation of th model for the receipt
function testGenerateModel() {
    var bookId = "agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAoITsoaMJDA";
    var transactionIds = "1c13381a-ecc4-4db7-a4ab-48cf19c983d2 3a5b72a6-a4bf-48f6-9e87-c18baf1d9dad";
    var book = BkperApp.openById(bookId);
    generateModel(book, transactionIds);
}
// create the receipt
function merge(model, templateUrl, folderId, doxeyApiKey) {

    if(doxeyApiKey == ""){
       var params = {
           'template': templateUrl,
           'model': model,
           'format': 'pdf' 
       };
    } else{
        var params = {
            'template': templateUrl,
            'model': model,
            'format': 'pdf',
            'apiKey': doxeyApiKey
        };
    }
    var options = {
        'contentType': "application/json",
        'method': 'post',
        'payload': JSON.stringify(params),
        'muteHttpExceptions': false
    };
    var response = UrlFetchApp.fetch('https://api.doxey.io/merge', options);
    var document = response.getBlob();
    var date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd-MM-yyyy');
    var receiptName = "Receipt " + date + ".pdf";
    document.setName(receiptName);
    var file = DriveApp.getFolderById(folderId).createFile(document);
    var receiptUrl = file.getUrl();
    return { receiptUrl, receiptName };
}
// test the creation of the receipt
function testMerge() {
    var bookId = "agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAoITsoaMJDA";
    var transactionIds = "1c13381a-ecc4-4db7-a4ab-48cf19c983d2 3a5b72a6-a4bf-48f6-9e87-c18baf1d9dad";
    var book = BkperApp.openById(bookId);
    const model = generateModel(book, transactionIds);
    merge(model);
}
// extract id from url for folder and docs
function getIdFromUrl(url) { return url.match(/[-\w]{25,}/); }
