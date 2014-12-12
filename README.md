htsApp
======

####HashtagSell Beta Application

#####Setting up HashtagSell Dev Environment on local machine:
Install Node And It’s Respective Components
- Node ~ v0.10.24
- NPM ~ v1.3.21
- MongoDB ~v2.6.3
- Go Programming Language ~ https://golang.org/doc/install
- FreeGeoIP ~ https://github.com/fiorix/freegeoip


#####Clone HashtagSell Dev Repo To Your Local Machine
Email username to admin@hashtagsell.com for share to private repo
- Commit often
- Comment your changes clearly


#####Install HashtagSell Dependencies On Your Local Machine.
- In Terminal: `cd /path/to/htsApp`
- In Terminal: `sudo npm install`
- All dependencies will be installed in a directory `Node Modules` in your htsApp folder
- In Terminal: `Bower install`
- All Javascript library dependencies will be installed into `bower_components` directory inside the htsApp project folder


#####Start MongoDB
Mongo must be running on your local machine before running HTS
- In Terminal: `sudo mongod --dbpath path/to/your/db`


#####Manually Create Your Access Key
- Manually create database after starting Mongo named: hts_app_db
- Manually create collection in hts_app_db named: early_access_keys
- Manually add your the JSON below to the early_access_keys collection
- Edit this JSON object below and add to your users table
```
{
    "secret" : {
        "expired" : false,
        "generated_by" : "anything@anywhere.com",
        "type_of_key" : "individual",
        "key" : "29a6f7",
        "used_by" : []
    }
}
```


#####Start FreeGeoIP
- In Terminal: `cd /path/to/freegeoip/directory`
- In Terminal: `./freegeoip`


#####Start HashtagSell Application
- In Terminal: `cd /path/to/htsApp`
- In Terminal: `grunt`
- NOTE: Your default browser should launch to localhost:8081.  Manually navigate here if not.


#####Create your user in HashtagSell User Interface
- Click user icon in top right-hand corner ---> “New Account”
- Supply a real email, and include your access code from your `early_access_keys` collection.
- Click the link in the “Welcome email” to activate your account.
- Sign into your account!  Woot!


#####Grunt Tasks (coming soon)
- `grunt build-dev` concatenates and minimizes all Javascript/CSS in /app directory and saves in /app/dist_dev.  You can test the generated files by updating index.ejs to use these files.
- `grunt commit-dev` picks up all files (even those generated by build-dev) and commits them github dev branch.  This repo is then deployed to dev EC2 @ dev.hashtagsell.com.
- `grunt deploy` concatenates and minimizes all Javascript/CSS in /app directory and saves in /app/dist_prod.  All production necessary files are included copied to /app/dist_prod.  /app/dist_prod is then pushed to github production branch and deployed to production EC2 @ beta.hashtagsell.com.