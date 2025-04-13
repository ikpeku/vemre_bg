require("dotenv").config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export const sendMail = ({ verificationToken, email}:{ verificationToken:string, email:string}) => {
    const msg = {
        to: email, // Change to your recipient
        from: 'ikpedaniel07@gmail.com', // Change to your verified sender
        subject: 'Vemre Password Code',
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
<!--[if !mso]><!-->
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<!--<![endif]-->
<!--[if (gte mso 9)|(IE)]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
<!--[if (gte mso 9)|(IE)]>
<style type="text/css">
body {width: 600px;margin: 0 auto;}
table {border-collapse: collapse;}
table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
img {-ms-interpolation-mode: bicubic;}
</style>
<![endif]-->

<!--user entered Head Start-->
<link href="https://fonts.googleapis.com/css?family=Fira+Sans+Condensed&display=swap" rel="stylesheet">
<style>
    body {
        font-family: 'Fira Sans Condensed', sans-serif;
    }
</style><!--End Head user entered-->
</head>

<body>
<center class="wrapper" data-link-color="#1188E6"
    data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#f0f0f0;">
    <h1>${verificationToken}</h1>
   
</center>
</body>

</html>`,
      }
      
      
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error: any) => {
          console.log(error)
        })

}


export const sendNotification = ({ message, email}:{ message:string, email:string}) => {
    const msg = {
        to: email, // Change to your recipient
        from: 'ikpedaniel07@gmail.com', // Change to your verified sender
        subject: 'Vemre Password Code',
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
<!--[if !mso]><!-->
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<!--<![endif]-->
<!--[if (gte mso 9)|(IE)]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
<!--[if (gte mso 9)|(IE)]>
<style type="text/css">
body {width: 600px;margin: 0 auto;}
table {border-collapse: collapse;}
table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
img {-ms-interpolation-mode: bicubic;}
</style>
<![endif]-->

<!--user entered Head Start-->
<link href="https://fonts.googleapis.com/css?family=Fira+Sans+Condensed&display=swap" rel="stylesheet">
<style>
    body {
        font-family: 'Fira Sans Condensed', sans-serif;
    }
</style><!--End Head user entered-->
</head>

<body>
<center class="wrapper" data-link-color="#1188E6"
    data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#f0f0f0;">
    <h1>${message}</h1>
   
</center>
</body>

</html>`,
      }
      
      
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error: any) => {
          console.log(error)
        })

}



