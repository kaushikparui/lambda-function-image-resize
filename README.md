
# Lambda Function For Image Resize (S3 to S3)


## Scenario

- Your application will upload image into source S3 bucket

- The Lambda Function will resize the image into two different size. Small with WIDTH (250 px) and Medium with WIDTH (450 px)


## Documentation
Here in the source code the main woking file is ```index.mjs```. You can modify according to your source path from the source S3 bucket and destination S# bucket paths as well.

- Here we have mentioned all the image related files name for the validation purpose. If any image that are uploaded into source S3 bucket without the listed image extention then the resize work will not be performed by Lambda function.

- You can able to check the log of the function from ```Cloudwatch```Log Group.

- **_Note_** : AWS Laambda function has two type of source code management.

* ``1.``**Direct upload of .zip file**
* ``2.``**Fetch the code from S3 bucket.**

- you can only upload your zipped code upto 10MB in direct. if the zip file size exceed above 10 MB, then S3 is the only option.
## Installation

Install my-project with npm

```bash
  npm install
```

## Environment Variables

Remember set the `DEST_BUCKET` in your Lambda's "Configuration" tab. To do this, open your Lambda in the AWS Console, select the "Configuration" tab, then click "Environment variables"

```bash
DEST_BUCKET=destination-bucket-name
```

## Deployment

Create a zip file so that you can able to upload the source code into Lambda Function.

```bash
  npm run package
```
