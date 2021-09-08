# GA-project-2

[Access the Landing Page Here](https://diylifestyle.herokuapp.com/)

## Description

Welcome to my first full-stack application!

## DiyLifeStyle

This project imagines a health and lifestyle product that lets user take charge and plan ahead their daily meals. User can control the quantity and calories intake of each meal. The product ultimately aims to help user achieve a fulfilling lifestyle with balance meal plans and exercise regimes.

Design is first conceived on Figma. Prototypes as show below:

![Figma Image](/public/images/figma_prototyping.jpg)

## Built with

- HTML/CSS/JavaScript
- [NodeJS](https://nodejs.org/en/) - Server-side JavaScript
- [express](https://expressjs.com/) - Create a server and accept requests
- [passport](http://www.passportjs.org/) - For Request Authentication
- [express-session](https://www.npmjs.com/package/express-session) - For storing server-side data
- [BCrypt](https://www.heroku.com) - Hashing algorithm for user login password
- [MongoDB](https://www.mongodb.com/) - No-Relational Database
- [Heroku](https://www.heroku.com) - PaaS Cloud Platform

## Homepage

![Home Image](/public/images/homepage.jpg)

## Login Page

![Login Image](/public/images/loginpage.jpg)

## Features

![Dashboard Image](/public/images/features.jpg)

## User Dashboard

![Dashboard Image](/public/images/indexpage.jpg)

## Detail Page

![Detail Image](/public/images/detailspage.jpg)

## Edit Page

![Detail Image](/public/images/editpage.jpg)

## Learning Points for Personal Reference

### Sessions

In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.

Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.

### OAuth

```
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // Used to specify the required data
  })
);

```

'Scope' specifies which user's Google information that you want your app to get access to. Refer [here](https://developers.google.com/identity/protocols/oauth2/scopes) for the complete list of scopes.

### Pagination

Typically 2 parameters are involved: Size and Page Number
