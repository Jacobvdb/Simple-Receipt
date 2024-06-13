## Simple Receipt App for Bkper 

Generates a simple pdf receipt based on selected transactions on your Bkper book. 


![Simple Receipt example](https://storage.googleapis.com/bkper-public/images/Help/bkper-simple-receipt.gif)

- Select the transaction(s) to generate a receipt for. 
- Open the **More** menu and select **Generate Receipt** in your book. 
- Based on the information of the selected transactions it will open a **pdf file** in another browser tab.




## Configuration

### Receipt Template
The Simple Receipt App uses this Google Doc as a default template:  [Simple Receipt Template](https://docs.google.com/document/d/1MMENpgkJu24RqHDtVvn9jEJRcEgBo_KtND123VFNTnk/edit?usp=sharing). Make your own copy of this template and customize it with your logo and address.
You can use the following expressions on the template.   

Receipt expresions

-```${receipt.date}``` : The date and time when the receipt is generated.   
-```${receipt.total}``` : The sum of the line items on the receipt. 

Book expresssions   

-```${book.property}``` : A book property.  

Transaction expresions   
-```$[transactions.date]``` : The post date of the line item.   
-```$[transactions.description]``` : The description of the line item.    
-```$[transactions.fromAccount]``` : The credit account of the line item.    
-```$[transactions.toAccount]``` : The debit account of the line item.    
-```$[transactions.amount]``` : The line item amount.     
-```$[transactions.property]``` : A line item property.     

**Note**: $[] refers to an iterator (more than one). Use these expressions in a table as in the default template.   
Now if you need to address a specific item from the iterator outside of a table, use ```${transactions[0].description}```

Account expressions    
-```${fomAccount.property}``` : A credit account property.     
-```${toAccount.property}``` : A debit account property.    


### Book Properties

The App interacts with the following properties on your book:

- ```receipt_template_url```: Optional - The Url of the Google Docs Template used to generate your receipts. 
- ```doxey_api_key```: Optional - Remove the Doxey watermark of your receipts by adding your Doxey API key to your book.

**Note**: although optional it's recomended to use your own personalized receipt template.



### Third Party Service Doxey
Simple Receipt App uses [doxey.io](https://www.doxey.io/) to merge the transaction data from your book into the Google Docs Tempate in order to generate the pdf receipt.
You can use the free version that comes with a watermark or either remove the watermark by using the paid version adding your Doxey API Key to the book properties.    
Learn more about the use of Template expression the [Doxey Help Center](https://help.doxey.io/en/templates/overview.html)





