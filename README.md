# diyLifeStyle - Healthy Meal Planning App

Access [Live Demo](https://diylifestyle.herokuapp.com/) :globe_with_meridians:

## Motivation

A subscription based meal-planning services to allow users to achieve a healthy lifestyle. Users can customise their own meal to monitor their daily or monthly calorie intake. This application strives to become a health and lifestyle product that lets user take charge and plan their ideal healthy lifestyle.

User can control the quantity and calories intake of each meal. The product ultimately aims to help user achieve a fulfilling lifestyle with balance meal plans and exercise regimes.

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
- [Heroku](https://www.heroku.com) - PaaS Provider

## Preview

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

## Signup Success Page

![Detail Image](/public/images/SignUpSuccess.jpg)

## Login Success Page

![Detail Image](/public/images/SignUpGoogleAuth.jpg)

## Learning Points for Personal Reference

### 1. Sessions

In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.

Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.

### 2. OAuth

```
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // Used to specify the required data
  })
);

```

'Scope' specifies which user's Google information that you want your app to get access to. Refer [here](https://developers.google.com/identity/protocols/oauth2/scopes) for the complete list of scopes.

### 3. Pagination

Typically 2 parameters are involved: Size and Page Number

### 4. Understanding Node Error [ERR_HTTP_HEADERS_SENT]

This error means that a part of your code is attempting to send a header after the body has already been written to the HTTP response.

It’s similar to when you send a formal letter. The letter can only be sent if you include an address. Without an address, your letter isn’t going anywhere, which means that nobody will be able to read its content.

The headers and body on an HTTP responsive work the same way. When sending headers with your HTTP response, you must write the headers before sending the body, otherwise you won’t be able to send the content of the body.

Refer [here](https://www.codementor.io/@oparaprosper79/understanding-node-error-err_http_headers_sent-117mpk82z8) to read more.

### 5. Use CSS object-fit Property

```
img{
  object-fit: cover;
}
```

The default property is 'fill', but use 'cover' to maintain the aspect ratio of img or video after you resized it to fit your dimension. 'cover' means the image will be clipped to fit. Refer [here](https://www.w3schools.com/css/css3_object-fit.asp) for more info.

### 6. Simple CSS animation to improve user interaction

```
.animating:hover {
  animation: animating 2s;
}

@keyframes animating {
  0% {
    transform: matrix(1, 0, 0, 1, 0, 0);
  }
  50% {
    transform: matrix(1, 0, 0, 1, 0, -22);
  }
  100% {
    transform: matrix(1, 0, 0, 1, 0, 0);
  }
}
```
