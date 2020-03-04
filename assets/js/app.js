/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// Les imports importants

import React from 'react';
import ReactDOM from "react-dom";

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log('Hello Julien, tu peux me modifier sur assets/js/app.js');

const App = () => {
    return (
        <>
            <Navbar />
            <div className="container pt-5">
                <HomePage/>
            </div>
        </>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);
