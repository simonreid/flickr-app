
# Getting started with flickr-app
flickr-app is a project designed to retrieve and display images using the flickr api.
This project is currently configured to get NASA images, but could easily be extended to retrieve and browse multiple users' photos.

It uses a NodeJS back-end with express routing, and an AngularJS front-end to enable users to browse NASA's public photos and obtain information about the photos as well as obtain an original-size image of the photo.  After all- Hubble pictures deserve high resolution!


## 1. Clone the app

Once you clone the git repository, use npm and bower to install dependencies.
  ```
  git clone https://github.com/simonreid/flickr-app.git
  ```

  ```
  npm install
  ```

  ```
  bower install
  ```

  Peruse the files in the directory structure to familiarize yourself with the contents.

## 2. Run the app locally

Install the dependencies listed in the [package.json](https://docs.npmjs.com/files/package.json) file to run the app locally.  
  ```
  npm start
  ```

Alternatively you can use:
  ```
  node server.js
  ```

If running locally, use these settings:
  ```
  ./config/config.global.js, config.offline = true;
  ./public/js/app.js, options.server_url = "http://localhost:3000";
  ```

View your app at: http://localhost:3000

## 2. Basic server testing

Perform testing, as defined in ./test/test.js, with mocha:
  ```
  npm test
  ```
