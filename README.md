<!-- PROJECT LOGO -->
<p align="center">
  <h3 align="center">Angular Cookbook app</h3>
  <p align="center">
    An Angular app for storing recipes
    <br/>
    <br/>
    <a href="https://ng-course-recipe-book-fd2ff.web.app/">View App</a>
  </p>
</p>
<br/>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#initialisation">Initialisation</a></li>
      </ul>
    </li>
  </ol>
</details>
<br/>


<!-- ABOUT THE PROJECT -->
## About The Project

The features that this app provides are the following:
* User authentication.
* Creat, view, edit, delete user recipes.
* Send recipe ingredients to shopping list.

### Built With

* [Angular](https://angular.io/api/common/SlicePipe)
* [NgRx](https://ngrx.io/)
* [Bootstrap](https://getbootstrap.com)
* [Google Firebase](https://firebase.google.com)

<!-- GETTING STARTED -->
## Getting Started

This app uses Google Firebase for data storage so an API key is required.

### Prerequisites

* [Google Firebase API](https://www.mongodb.com/cloud/atlas)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/kikooOOoo16/AngularCookBook.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Inside the angular app, in the src directory, create the environments directory and add the following value:
      ```TS
    export const environment = {
      production: false,
      fireBaseApiKey: 'API key',
      firebaseConfig: {
        firebase config object
      }
    };
   ```
### Initialisation

1. To start the Angular app just run  :
   ```sh
   ng serve
   ```

<!-- CONTACT -->
## Contact

Kristijan Pavlevski - kristijan.pavlevski@outlook.com

Project Link: [https://github.com/kikooOOoo16/AngularCookBook](https://github.com/kikooOOoo16/AngularCookBook)
