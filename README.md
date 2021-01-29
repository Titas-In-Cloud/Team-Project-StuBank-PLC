### Description
**StuBank PLC** is a simple and reliable banking platform focused on students with minimalistic design and basic 
functionality. It was created during **CSC2033** team software development module at *Newcastle University*.

### Getting Started
Start by downloading the required packages. Make sure you are in the **/root** folder of the 
project and input the command below in the ````Terminal```` to download require packages:
````
npm run build
````
After the package installation is complete run the program in the ````Terminal```` by executing a command below:
````
npm run dev
````
### Usage
Once the program will start it will open a browser window, and you will be greeted with a home page of the banking
platform. There are three pages on the navigation bar - **Home**, **FAQ** and **Login**.
+ **Home** page is the home page of our banking platform which is accessible to all clients without logging in.
+ **FAQ** page has some common questions and answers about our banking platform.
+ **Login** page lets you to login to your current account or register a new bank account on our banking platform.

#### User Access
Click *Get Started*, *Make an Account Now* buttons or go to **Login** page on navigation bar to create a new account. 
After creating an account you will be redirected to a bank account overview page.

On the overview page scan the bar code with Google Authenticator app on your smartphone to activate 2FA. It's important
to do this because there will be no way to login without it after you exit the application.

##### Google Authenticator Activation Process

Go to **App Store** on your iPhone or **Google Play Store** on your Android device and search for 
**Google Authenticator**. Click on the top option and install.

<img src="root/client/public/images/Play Store Search.jpg" width="30%" alt="">

<img src="root/client/public/images/Play Store Authenticator.jpg" width="30%" alt="">

After installation, open **Authenticator** app and click the plus symbol on the bottom right to scan the bar code. Once
it's done it is all set up and there should be 6 number code which changes each 30 seconds. This will be used the next 
time you will try to login to your account.

#### Certificate Installation Process

Run the program normally and when it loads there should be a warning about the website being insecure. Click the
security symbol (normally to the left of the URL) in your browser, and click certificate. On the popup, navigate to the
details tab and click copy to file. Click next and choose DER encoded binary X.509 (.CER) as the option (should be
default option). Click next and on the next page click browse, and then type in any name for your certificate and choose
the download location. Then click save to close the dialog box, and then next and finish. Then open the folder where the
certificate was downloaded, then open it and choose install certificate. Choose current user or local machine depending
on your preferred installation, and click next. Then choose place all certificates in the following store, and choose
trusted root certification authorities. Then click next and finish and restart close your browser and restart the
application. The connection will now be secure.

#### User Account Functionality
User bank account has four pages which you can see on the navigation bar on the left - **Overview**, **Transactions**, 
**Account** and **Cards**. 
+ **Overview** page shows 6 most recent transactions as well as the balance of your GBP, USD and EUR account. 
+ **Transactions** page shows all the transaction history made from, or to an account with the balance of either 
  GBP, USD and EUR account.
+ **Account** page shows the balance of GBP, USD and EUR accounts, lets you transfer money to another account by
  clicking *New Transfer* button, inputting another account Personal ID, amount of money and pressing *Submit* button.
  Also, you can exchange your currencies by clicking *Convert Currencies* button, choosing the currencies,
  inputting the amount of money to convert and upon pressing *Submit* button your currencies will be converted. The
  transactions will be shown in your transaction history.
+ **Cards** page lets you generate a new virtual card with a new card number and CVV code. It is more of a design
  component rather than functionality because there is no way to use a virtual card with our program. In the real world
  scenario it would work as a normal virtual card which could be used to buy items from the internet by inputting your 
  card details.
  
When logged in as a user you can amend your details or delete your account by clicking the *Settings* button in the top 
right corner. Here you can see your details, such as user ID, first and last names, your telephone number and email. 
You can amend these details and/or change your password by clicking *Amend Details* button, changing your details and
clicking *Amend* button. If you want to delete and account, click *Delete Account* button and confirm your choice. 

You can log out by pressing red *Logout* button in the top right corner and confirming your choice. You will be
redirected to **Login** page.

### Admin Account
To access admin account you will login as usual from *login* page, however, because there is no way to create an admin
account for the regular user, one admin account is already created in the database. Admin account details:

**Personal ID**: 11111111111

**Password**: Password11

Login with these details to access admin account. Google authenticator is not required for the admin account

After login you will see 2 pages on the navigation bar on the left - **Users** and **New Admin**. 
+ **Users** page shows 
  a list of current created accounts with their details as well as an option to amend the users details by inputting 
  users Personal ID and clicking *Amend Details* button. 
+ **New Admin** page lets you create a new admin account if needed.

You can log out by pressing red *Logout* button in the top right corner and confirming your choice. You will be
redirected to **Login** page.

### License
This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/) see the LICENSE.md file
for details.