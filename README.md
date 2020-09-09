# Travel App
This travel app obtains a desired trip location & date from the user, and displays weather and an image of the location using information obtained from external APIs. 

## Installation
This project uses numerous dependencies, including:
```
"dependencies": {
    "babel-jest": "^26.3.0",
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "node-fetch": "^2.6.0",
    "webpack": "^4.44.1",
    "webpack-cli": "^3.3.12"
  },
  "devDependencies": {
    "@babel/core": "^7.11.1",
    "@babel/preset-env": "^7.11.0",
    "babel-loader": "^8.1.0",
    "clean-webpack-plugin": "^3.0.0",
    "css-loader": "^3.0.0",
    "html-webpack-plugin": "^3.2.0",
    "jest": "^25.5.4",
    "mini-css-extract-plugin": "^0.9.0",
    "node-sass": "^4.12.0",
    "optimize-css-assets-webpack-plugin": "^5.0.3",
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.1",
    "terser-webpack-plugin": "^1.4.5",
    "webpack-dev-server": "^3.7.2",
    "workbox-webpack-plugin": "^5.1.3"
  }
```

- To install these dependencies, download NPM and clone this repository. Make sure you're in the same file directory you cloned this repo to in either a NPM or Git Command Terminal, then type `npm install` to install the above dependencies. 
- To use this app, you need to have an API key from MeaningCloud for Sentiment Analysis. Click this [link](https://www.meaningcloud.com/developer/getting-started) to setup an account with MeaningCloud to get an API key. Click this [link](https://www.meaningcloud.com/developer/sentiment-analysis/doc) to learn more about MeaningCloud's Sentiment Analysis API.

## Usage
- Find the server-side index file by navigating through the `src` then `server` folders and opening the `index.js` file. 
- Store your MeaningCloud API key as a variable in the `index.js` file. Replace the `process.env.API_KEY` variable in line 36 with the variable name you used to store your API key.  
- Make sure you're in the same file directory you cloned this repo to in either a NPM or Git Command Terminal and type `npm run build-prod` (this will cause Webpack to create a 'dist' folder, effectively building the production environment for this app).  
- Type `npm run start` in the same Command Terminal in the same directory as the previous step to setup a local server. 
- Open your preferred browser and type `localhost:3000` in the address bar and hit enter. 
- Type or copy/paste a valid http or https URL into the provided text area then click 'submit'.
- Click 'get results' to reveal what MeaningCloud's Sentiment Analysis API gleaned about the text content on the website you entered.


## Suggestion to Make Your Project Stand Out used: 
 - Results show the flag of the country the user plans to visit based on a fetch request from the REST Countries API.
 - Pull in an image from Pixabay API when the entered location brings up no results.
 - Use Local Storage to save the data so that when the user closes, then revisits the page, their information is still there.
 


