// Compiled using ts2gas 3.6.4 (TypeScript 4.2.3)
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
function doGet(e) {
    var bookId = e.parameter.bookId;
    var transactionIds = e.parameter.transactionIds;
    var propertiesObj = checkProperties(bookId);
    if (propertiesObj.msg == "") {
        if (transactionIds) {
            var htmlTemplate = HtmlService.createTemplateFromFile('Dialog');
            htmlTemplate.dataFromServerTemplate = { bookid: bookId, transactionIds: transactionIds, msg: propertiesObj.msg, templateUrl: propertiesObj.templateUrl, doxeyApiKey: propertiesObj.doxeyApiKey };
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
        // Something wrong with the properties 
        var htmlTemplate = HtmlService.createTemplateFromFile('Dialog');
        htmlTemplate.dataFromServerTemplate = { bookid: bookId, transactionIds: transactionIds, msg: propertiesObj.msg, templateUrl: propertiesObj.templateUrl };
        var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
            .setTitle('Instructions');
    }
    return htmlOutput;
}

function checkProperties(bookId) {
    var book = BkperApp.openById(bookId);
    var properties = book.getProperties();
    var msg = "";

    //Receipt template
    // Check content of the property
    if (!properties.receipt_template_url) {
        var templateUrl = "https://docs.google.com/document/d/1MMENpgkJu24RqHDtVvn9jEJRcEgBo_KtND123VFNTnk/edit";
    }
    else {
        var templateUrl = properties.receipt_template_url;
    }
    
    //Doxey Api Key
    if (!properties.doxey_api_key) {
        // The document will use the watermark
        var doxeyApiKey = "";
    }
    else {
        doxeyApiKey = properties.doxey_api_key;
        // check the license
        var params = { 'apiKey': doxeyApiKey };
        var options = {
            'contentType': "application/json",
            'method': 'post',
            'payload': JSON.stringify(params),
            'muteHttpExceptions': false
        };
        try {
            UrlFetchApp.fetch('https://api.doxey.io/license', options);
            doxeyApiKey = "ok";
        }
        catch (e) {
            msg = "Please check the book property doxey_api_key <br><br>" + e;
        }
    }
    return { msg, templateUrl, doxeyApiKey };
}

// Initialize the Pop up in the book.
function initialize(bookId, transactionIds, msg, templateUrl, doxeyApiKey) {
    var book = BkperApp.openById(bookId);
    if (doxeyApiKey == "ok") {
        doxeyApiKey = book.getProperty("doxey_api_key");
    }
    // create the model 
    var model = generateModel(book, transactionIds);
    // get the document form doxey
    var document = merge(model, templateUrl, doxeyApiKey);
    return { document };
}

// Generation of the model for the receipt
function generateModel(book, transactionIds) {
    
    var model = {
        book: __assign(__assign({}, book.getProperties()), { name: book.getName() })
    };
    
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
            amount: transaction.getAmount().toFixed(2)
        });
        total += Number(transaction.getAmount());
    }
    //Receipt
    model.receipt = __assign({ total: total.toFixed(2), date: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss') });
    return model;
}

// Create the receipt pdf
function merge(model, templateUrl, doxeyApiKey) {
  Logger.log(templateUrl)
    if (doxeyApiKey == "") {
      Logger.log("no key");
        var params = {
            'template': templateUrl,
            'model': model,
            'format': 'pdf',
            'apiKey':''
        };
    }
    else {
         Logger.log("with key");
        var params = {
            'template': templateUrl,
            'model': model,
            'format': 'pdf',
            'apiKey': doxeyApiKey // no watermark
        };
    }
    var options = {
        'contentType': "application/json",
        'method': 'post',
        'payload': JSON.stringify(params),
        'muteHttpExceptions': false
    };
    var response = UrlFetchApp.fetch('https://api.doxey.io/merge', options);
   
    var blob = response.getBlob();
    var bytes = blob.getBytes();
    var encoded = Utilities.base64Encode(bytes);
    return encoded;
}



// Tests
// test the property check 
function testCheckProperties() {
    var bookId = "agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAoITsoaMJDA";

    checkProperties(bookId)
}
// test the generation of th model for the receipt
function testGenerateModel() {
    var bookId = "agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAoITsoaMJDA";
    var transactionIds = "1c13381a-ecc4-4db7-a4ab-48cf19c983d2 3a5b72a6-a4bf-48f6-9e87-c18baf1d9dad ";
    var book = BkperApp.openById(bookId);
    generateModel(book, transactionIds);
}
// test the creation of the receipt
function testMerge() {
    var bookId = "agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAoITsoaMJDA";
    var transactionIds = "1c13381a-ecc4-4db7-a4ab-48cf19c983d2 3a5b72a6-a4bf-48f6-9e87-c18baf1d9dad 29aac2a5-d5c5-4dbc-a98d-9eacd6312ef4";
    var folderId = "13d36TqAJ8sLdevN95FhK7jyXblBv_Grz";
    var doxeyApiKey = "";
    var templateUrl = "https://docs.google.com/document/d/1MMENpgkJu24RqHDtVvn9jEJRcEgBo_KtND123VFNTnk/edit";
    var book = BkperApp.openById(bookId);
    const model = generateModel(book, transactionIds);
    merge(model, templateUrl, folderId, doxeyApiKey);
}



function testregex( ){
  var url = "https://docs.google.com/document/d/1MMENpgkJu24RqHDtVvn9jEJRcEgBo_KtND123VFNTnk/edit"
  Logger.log(url.match(/[-\w]{25,}/))
  var id =url.match(/[-\w]{25,}/)

  DriveApp.getFileById('1MMENpgkJu24RqHDtVvn9jEJRcEgBo_KtND123VFNTnk')
}


