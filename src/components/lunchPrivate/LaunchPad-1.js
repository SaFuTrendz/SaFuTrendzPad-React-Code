import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { getNetFeeValueLaunch } from '../../actions/authActions';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import axios from 'axios';
import { Col, Row } from 'rsuite';
import lunchpadImg from '../assets/img/back/Spaceship_08-removebg-preview@2x.png';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { RiErrorWarningFill } from 'react-icons/ri';
import isEmpty from '../../validation/isEmpty';

var netValue = '';

class LaunchPad1 extends Component {
	constructor(props) {
		super(props);

		this.onSuccess = this.onSuccess.bind(this);

		this.state = {
			abi: '',
			tokenName: '',
			tokenSymbol: '',
			tokenDecimals: '',
			tokenSupply: '',
			tokenAddress: '',
			tokenAddressError: '',
			tokenAddressValid: false,
			formValid: false,
			tokenChainValid: false,
			tokenAddressOrig: []
		};
	}

	componentDidMount() {
		window.scrollTo(0, 0);
		this.props.getNetFeeValueLaunch();
		axios
			.get(`/api/getTokenContractAbi`)
			.then(async (res) => {
				const abi = res.data;
				this.state.abi = abi;
			})
			.catch((err) => console.log(err));

		axios
			.get(`/api/getAll`)
			.then(async (res) => {
				this.state.tokenAddressOrig = res.data;
			})
			.catch((err) => console.log(err));
	}

	handleInput(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value }, () => {
			this.validateField(name, value);
		});
	}

	validateField(fieldName, value) {
		let tokenAddressError = this.state.tokenAddressError;
		let tokenAddressValid = this.state.tokenAddressValid;

		tokenAddressError =  !isEmpty(value) ? true : false;

		if (tokenAddressError) {
			tokenAddressValid = true;
		} else {
			tokenAddressValid = false;
		}

		this.setState(
			{
				tokenAddressError: tokenAddressError,
				tokenAddressValid: tokenAddressValid,
				formValid: tokenAddressError
			},

		);
	}



	onSuccess() {

		localStorage.setItem("tokenName", this.state.tokenName);
	}

	render() {
		if (this.props.auth.netFeeLaunch !== undefined) {
			const { netFeeLaunch } = this.props.auth;

			if (netFeeLaunch !== undefined) {
				switch (window.localStorage.getItem('chainId')) {
					case '1':
						netValue = `${netFeeLaunch.data.ETH} ETH`;
						break;
					case '3':
						netValue = `${netFeeLaunch.data.Ropsten} ETH`;
						break;
					case '56':
						netValue = `${netFeeLaunch.data.BSC} BNB`;
						break;
					case '97':
						netValue = `${netFeeLaunch.data.BSCTest} tBNB`;
						break;
					case '43114':
						netValue = `${netFeeLaunch.data.Avalanche} AVAX`;
						break;
					case '43113':
						netValue = `${netFeeLaunch.data.AvalancheTest} TAVAX`;
						break;
					case '25':
						netValue = `${netFeeLaunch.data.Cronos} CRO`;
						break;
					case '941':
						netValue = `${netFeeLaunch.data.PulseTest} tPLS`;
						break;
					case '137':
						netValue = `${netFeeLaunch.data.Polygon} MATIC`;
						break;
					default:
						netValue = '0.7 BNB';
						break;
				}
			}
		}
		return (
			<div>
				<section className="ant-layout black-background">
					<main className="ant-layout-content MainLayout_content__2mZF9">
						<div className="py-6 container">
							<div style={{ height: '16px' }} />

							<div className="bg-dark  style-border ant-card ant-card-bordered">
								<div className="ant-card-body">
									<div className="lead2" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
										<Row>
											<Col md={12} xs={24}>
												<h1
													className=" text-center"
													style={{ fontSize: '40px', marginTop: '10px' }}
												>
													VERIFY PRIVATE TOKEN{' '}
													<BsFillPatchCheckFill
														style={{
															marginBottom: '20px',
															marginLeft: '-10px',
															height: '20px',
															width: '20px',
															color: '#0F3CB2'
														}}
													/>
												</h1>
												<p className="text-center socials" style={{ fontSize: '20px' }}>
													Get Started in 4 easy steps
												</p>
											</Col>
											<Col md={12} xs={24}>
												<img
													src={lunchpadImg}
													alt="launchpad image"
													style={{ width: '200px', height: '200px' }}
												/>
											</Col>
										</Row>
									</div>
									<form style={{ marginTop: '180px' }}>
										<div className="field">
											<div className="row is-flex is-align-items-center mb-2 flex-wrap">
												<div className="is-flex-grow-1 mr-4" style={{ marginLeft: '10%' }}>
													<div className="token-buffey">
														<div>
															<h3
																style={{
																	fontSize: '23px',
																	height: 'auto !important'
																}}
															>
																Title
															</h3>
														</div>
													</div>
												</div>
											</div>
											<div className="form-group">
												<input
													name="tokenName"
													value={this.state.tokenName}
													onChange={(event) => this.handleInput(event)}
													className={classnames('form-control form-control-lg', {
														'is-invalid': this.state.tokenAddressError
													})}
													type="text"
													placeholder="Ex: This is my private sale"
													id="tokenAddress"
													autoComplete="off"
												/>

												<div className="invalid-feedback">{this.state.tokenAddressError}</div>
											</div>
										</div>

										<Link to={this.state.formValid ? '/PrivateLaunch2' : '#'}>
											<button
												className="launch-button"
												disabled={!this.state.tokenAddressError}
												style={{ marginTop: '180px' }}
												onClick={this.onSuccess}
											>
												<strong>NEXT</strong>
											</button>
										</Link>

										<p
											className="help is-info"
											style={{ fontSize: '18px', marginTop: '40px', marginBottom: '20px' }}
										>
											Create pool fee: {netValue}
										</p>
									</form>
									<div className="launchbottom-text">
										<RiErrorWarningFill
											style={{
												height: '30px',
												width: '30px',
												color: '#FF0000',
												// marginRight: '100px',
												marginBottom: '-8px'
											}}
										/>
										<span className="text-center">
											Make sure your token has 'exclude transfer fee' function if it has transfer
											fees
										</span>
									</div>
								</div>
							</div>
						</div>
					</main>
				</section>
			</div>
		);
	}
}

LaunchPad1.propTypes = {
	getNetFeeValueLaunch: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
		errors: state.errors
	};
};

export default connect(mapStateToProps, { getNetFeeValueLaunch })(LaunchPad1);
