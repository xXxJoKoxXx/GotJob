import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import {
	BrowserRouter
} from 'react-router-dom';

import reducers from './reducer';
import App from './app'
import './config';
import './index.css'

const store = createStore(reducers, compose(
	applyMiddleware(thunk),
	window.devToolsExtension ? window.devToolsExtension() : f => f,
))

// ReactDOM.render
ReactDOM.hydrate(		//使用字节流进行服务端渲染，render替换成hydrate
	(<Provider store = { store } >
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>), 
	document.getElementById('root')
);

