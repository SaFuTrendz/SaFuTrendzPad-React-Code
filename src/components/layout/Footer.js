import React, { useState, useEffect } from 'react';
import Logo from '../assets/img/logo.png';
import { FaGlobe, FaTwitter, FaTelegram } from 'react-icons/fa';
import axios from 'axios';

const Footer = () => {
	const [ address, setAddress ] = useState();

	const onAddAddress = () => {
		const data = {
			url: address
		};

		console.log(data);
		axios
			.post('/api/auth/setUserAddress', data)
			.then((res) => {
				console.log(res);
				alert('Successfylly Address Input!');
			})
			.catch((err) => {
				console.log(err);
				alert(err);
			});
	};

	return (
		<div className="footer flex text-center">
			<div
				className="footer-wrapper container flex-column"
				style={{
					marginBottom: '0px',
					marginTop: '100px',
					paddingTop: '32px',
					paddingBottom: '32px'
				}}
			>
				<h4>Do Not Miss Any Presale Subscribe To Our Newsletter</h4>
				<div>
					<div>
						<input
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							type="text"
							placeholder="Ex: email@example.com"
							id="tokenAddress"
						/>
						<button onClick={onAddAddress} className="launch-button" style={{ marginTop: '30px' }}>
							SUBSCRIBE
						</button>
					</div>
				</div>

				<div className="footer-logo flex-center" style={{ paddingBottom: '32px' }}>
					<a href="https://safutrendz.com/">
						<img src={Logo} className="photo" alt="logo" style={{ width: '120px', height: '120px' }} />
					</a>
				</div>
				<div className="footer-copyright text-white" style={{ paddingBottom: '32px' }}>
					<strong className="text-white" style={{ color: 'white' }}>
						Copyright Reserved @{new Date().getFullYear()} SafuTrendz
					</strong>
				</div>
				<div className="flex-center">
					<a href="https://twitter.com/safu_trendz" style={{ marginTop: '15px' }}>
						<FaTwitter size={35} color={'rgb(235,209,95)'} style={{ marginLeft: '7px' }} />
					</a>
					<a href="https://t.me/safu_trendz" style={{ marginTop: '10px' }}>
						<FaTelegram size={35} color={'rgb(235,209,95)'} style={{ marginLeft: '7px' }} />
					</a>
					<a href="https://safutrendz.com">
						<FaGlobe size={35} color={'rgb(235,209,95)'} style={{ marginLeft: '7px' }} />
					</a>
				</div>
			</div>
		</div>
	);
};

export default Footer;
