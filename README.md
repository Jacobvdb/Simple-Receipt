Simple Receipt App for Bkper 

Generates a simple pdf receipt based on selected transactions on your Bkper book. 




![Simple Receipt example](https://storage.googleapis.com/bkper-public/images/Help/bkper-simple-receipt.gif)

- Select the transaction(s) to generate a receipt for. 
- Open the **More** menu and select **Generate Receipt** in your book. 
- Based on the information of the selected transactions it will store a **pdf file** Google Drive Folder that is specified in a book property.




## Configuration

The App interacts with the following properties:

### Book Properties

- ```receipt_folder_url```: Required - The Url of the Google Drive folder where the app saves your receipts.
- ```receipt_template_url```: Optional - The Url of the Google Docs Template used to generate your receipts. 

**Note**: although optional it's recomended to use your own Receipt template.


