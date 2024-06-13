// Compiled using ts2gas 3.6.4 (TypeScript 4.2.3)

function doGet(e) {
    if (!e || !e.parameter || !e.parameter.bookId || !e.parameter.transactionIds) {
        // Handle the case when the bookId or transactionIds parameter is missing
        var msg = "Missing bookId or transactionIds parameter";
        var status = 400; 
        return ContentService.createTextOutput("Missing bookId or transactionIds parameter");
    } else {
        setUserProperty("bookId", e.parameter.bookId);
        setUserProperty("transactionIds", e.parameter.transactionIds);

        var book = BkperApp.openById(e.parameter.bookId);
        
        // Increment the receipt number
        incrementReceiptNumber(book);
 
       
        var bookName = book.getName()
        setUserProperty("bookName", book.getName());
        setUserProperty("bookDatePattern", book.getDatePattern());
        setUserProperty("bookTimeZone", book.getTimeZone());
    
        var msg = "Preparing your receipt";
        var status = 200;
    }
    var htmlTemplate = HtmlService.createTemplateFromFile('Addon');
    htmlTemplate.dataFromServerTemplate = { bookName: bookName, msg: msg , status: status};
    var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle('Generate Receipt');

 return htmlOutput;
}

// Initialize the Pop up in the book.
function getReceipt() {
   
    var bookId = getUserProperty("bookId");
    var book = BkperApp.getBook(bookId);
    var transactionIds = getUserProperty("transactionIds");
     
    // create the model 
    var model = generateModel(book, transactionIds);
    var templateUrl = model.book.receipt_template_url || "https://docs.google.com/document/d/1MMENpgkJu24RqHDtVvn9jEJRcEgBo_KtND123VFNTnk/edit";
    var doxeyApiKey = checkDoxeyApiKey(model.book.doxey_api_key) ;

    
    // in case there is no receipt_number book property, create and define one
    if (!model.book.receipt_number) {
        book.setProperty("receipt_number", "1001");
        book.update();
        model.book.receipt_number = "1001";
    } 

    // get the document form doxey
    var document = merge(model, templateUrl, doxeyApiKey);
    
    // Increment the receipt number
    incrementReceiptNumber(book);
 
    // cleanup properties
    setUserProperty("bookId", "")
    setUserProperty("transactionIds", "")
    book.update();

    return { document };
}


function generateModel(book, transactionIds) {
    const transactionIdsArray = transactionIds.split(" ");
   
    // Initialize the model object
    var model = {
        transactions: [],
        receipt: {
            total: 0,
            date: new Date().toLocaleString()
        },
        fromAccount: {},
        toAccount: {},
        book: book.getProperties() // Include all book properties
    };

    for (var i = 0; i < transactionIdsArray.length; i++) {
        let transactionId = transactionIdsArray[i];
        let transaction = book.getTransaction(transactionId);
        let properties = transaction.getProperties();

        // Fetch credit and debit accounts
        let creditAccount = transaction.getCreditAccount();
        let debitAccount = transaction.getDebitAccount();
        
        // Fetch account properties
        let creditAccountProps = creditAccount.getProperties();
        let debitAccountProps = debitAccount.getProperties();

        // Set fromAccount properties if not already set
        if (i === 0) { // Assuming the first transaction's accounts are representative
            model.fromAccount = creditAccountProps;
            model.toAccount = debitAccountProps;
        }

        // Create a transaction object
        let transactionObject = {
            date: transaction.getInformedDateText(),
            description: transaction.getDescription(),
            fromAccount: creditAccount.getName(),
            toAccount: debitAccount.getName(),
            amount: transaction.getAmount().toFixed(2)
        };

        // Add transaction properties as key-value pairs
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                transactionObject[key] = properties[key];
            }
        }

        // Update receipt total
        model.receipt.total += parseFloat(transaction.getAmount());

        // Push the transaction object into the model.transactions array
        model.transactions.push(transactionObject);
    }

    // Format the receipt total to two decimal places
    model.receipt.total = model.receipt.total.toFixed(2);

    Logger.log(model)

    return model;
}


// Create the receipt pdf
function merge(model, templateUrl, doxeyApiKey) {
    if (doxeyApiKey == "") {
        var params = {
            'template': templateUrl,
            'model': model,
            'format': 'pdf',
            'apiKey':''
        };
    }
    else {
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
    var document = response.getBlob();
    var bytes = document.getBytes();
    var encoded = Utilities.base64Encode(bytes);
    return encoded;
}


function setUserProperty(propertyKey, propertyValue) {
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty(propertyKey, propertyValue);
    return;
}

function getUserProperty(propertyKey) {
    var userProperties = PropertiesService.getUserProperties();
    var propertyValue = userProperties.getProperty(propertyKey);
    return propertyValue;
}

function checkDoxeyApiKey(doxeyApiKey){
    if (doxeyApiKey) {
        try {
            var params = { 'apiKey': doxeyApiKey };
            var options = {
                'contentType': "application/json",
                'method': 'post',
                'payload': JSON.stringify(params),
                'muteHttpExceptions': false
            };
            UrlFetchApp.fetch('https://api.doxey.io/license', options);
        } catch (e) {
            msg = "Please check the book property doxey_api_key <br><br>" + e;
            doxeyApiKey = "";
        }
  
        return doxeyApiKey
    } else { return ""}
}

function incrementReceiptNumber(book) {
    var currentNumber = parseInt(book.getProperty("receipt_number"));
    book.setProperty("receipt_number", (currentNumber + 1).toString());
    book.update();
}
