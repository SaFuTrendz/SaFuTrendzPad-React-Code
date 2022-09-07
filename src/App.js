import React, { useState, useEffect } from 'react';

import './App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MoralisProvider } from 'react-moralis';
import { Provider } from 'react-redux';
import store from './store.js';

import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';

import { setCurrentUser, logoutUser } from './actions/authActions';

import Header from './components/layout/Header';
import Header2 from './components/layout/Header2';
import Footer from './components/layout/Footer';
import Dashboard from './components/dashboard/Dashboard';
import PadList from './components/pad/PadList';
import PadInfo from './components/pad/PadInfo';
import CreateToken from './components/token/CreateToken';
import LaunchPad1 from './components/lunch/LaunchPad-1';
import LaunchPad2 from './components/lunch/LaunchPad-2';
import LaunchPad3 from './components/lunch/LaunchPad-3';
import LaunchPad4 from './components/lunch/LaunchPad-4';
import TokenRes from './components/token/TokenRes';
import LaunchRes from './components/lunch/LaunchRes';
import AuthSetting from './components/auth/AuthSetting';
import Login from './components/auth/Login';
import PrivateRouter from './components/common/PrivateRouter';
import FairLaunch1 from './components/fairLaunch/FairLaunch1';
import FairLaunch2 from './components/fairLaunch/FairLaunch2';
import FairLaunch3 from './components/fairLaunch/FairLaunch3';
import FairLaunch4 from './components/fairLaunch/FairLaunch4';
import FairLaunchRes from './components/fairLaunch/FairLaunchRes';
import PrivateLaunch1 from './components/lunchPrivate/LaunchPad-1';
import PrivateLaunch2 from './components/lunchPrivate/LaunchPad-2';
import PrivateLaunch3 from './components/lunchPrivate/LaunchPad-3';
import PrivateLaunch4 from './components/lunchPrivate/LaunchPad-4';
import PrivateLaunchRes from './components/lunchPrivate/LaunchRes';

import { useMoralis } from 'react-moralis';

import { moralisId, moralisServer } from './config';

import PieChart from './PieChart';

import web3 from 'web3';

// Check for token
const token = localStorage.jwtToken;

if (token) {
	// set the header auth
	setAuthToken(token);

	// decode token and get user info and exp
	const decoded = jwt_decode(token);

	// set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded));
	// // Check for expired token
	const currentTime = Date.now() / 1000;

	if (decoded.exp < currentTime) {
		// Logout User
		store.dispatch(logoutUser());
		window.location.reload();
		// Redirect to login
	}
}

const APP_ID = 'Ra5TzI8AtWDIYG7k88juzx3zhEr6YZ8ghVUx8F34';
const SERVER_URL = 'https://yi52hrws3oqw.usemoralis.com:2053/server';

function App() {
	// const [ chainId, setChainId ] = useState();

	useEffect(() => {
		// Moralis.start({ serverUrl: moralisServer, appId: moralisId });
		// window.localStorage.setItem('chainId', parseInt(web3.givenProvider.chainId, 16));
		//window.localStorage.setItem('userAddress', web3.givenProvider.selectedAddress);
		// setChainId(parseInt(web3.givenProvider.chainId, 16));
	}, []);

	return (
		<MoralisProvider
			serverUrl="https://4stgo3byiouu.usemoralis.com:2053/server"
			appId="WM7HbKDQpxeyi1Nfe4gZRwmXmOukv4l6FJPBza81"
		>
			<Provider store={store}>
				<Router>
					<div className="App">
						<div className="dark-overly">
							<Header />
							<main className="main">
								<Header2 />
								<Route exact path="/" component={Dashboard} />
								<Switch>
									<Route exact path="/PadList" component={PadList} />
								</Switch>
								<Switch>
									<Route exact path="/PadInfo/:id" component={PadInfo} />
								</Switch>
								<Switch>
									<Route exact path="/CreateToken" component={CreateToken} />
								</Switch>
								<Switch>
									<Route path="/LaunchPad1" component={LaunchPad1} />
								</Switch>
								<Switch>
									<Route path="/LaunchPad2" component={LaunchPad2} />
								</Switch>
								<Switch>
									<Route exact path="/LaunchPad3" component={LaunchPad3} />
								</Switch>
								<Switch>
									<Route exact path="/LaunchPad4" component={LaunchPad4} />
								</Switch>
								<Switch>
									<Route exact path="/TokenRes" component={TokenRes} />
								</Switch>
								<Switch>
									<Route exact path="/LaunchRes" component={LaunchRes} />
								</Switch>
								<Switch>
									{/* <Route exact path="/authSetting" component={AuthSetting} />  */}

									<PrivateRouter exact path="/authSetting" component={AuthSetting} />
								</Switch>
								<Switch>
									<Route exact path="/login" component={Login} />
								</Switch>
								<Switch>
									<Route exact path="/FairLaunch1" component={FairLaunch1} />
								</Switch>
								<Switch>
									<Route exact path="/FairLaunch2" component={FairLaunch2} />
								</Switch>
								<Switch>
									<Route exact path="/FairLaunch3" component={FairLaunch3} />
								</Switch>
								<Switch>
									<Route exact path="/FairLaunch4" component={FairLaunch4} />
								</Switch>
								<Switch>
									<Route exact path="/FairLaunchRes" component={FairLaunchRes} />
								</Switch>
								<Switch>
									<Route exact path="/PrivateLaunch1" component={PrivateLaunch1} />
								</Switch>
								<Switch>
									<Route exact path="/PrivateLaunch2" component={PrivateLaunch2} />
								</Switch>
								<Switch>
									<Route exact path="/PrivateLaunch3" component={PrivateLaunch3} />
								</Switch>
								<Switch>
									<Route exact path="/PrivateLaunch4" component={PrivateLaunch4} />
								</Switch>
								<Switch>
									<Route exact path="/PrivateLaunchRes" component={PrivateLaunchRes} />
								</Switch>
								<Switch>
									<Route exact path="/test" component={PieChart} />
								</Switch>
								<Footer />
							</main>
						</div>
					</div>
				</Router>
			</Provider>
		</MoralisProvider>
	);
}

export default App;
