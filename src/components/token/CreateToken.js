import React, { Component } from 'react';
import classnames from 'classnames';
import isEmpty from '../../validation/isEmpty';
import axios from 'axios';
import Web3 from 'web3';
// import { withStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
import Spinner from '../common/Spinner';
import PropTypes from 'prop-types';
import { getEscrowAddress, getNetFeeValueToken } from '../../actions/authActions';
import { connect } from 'react-redux';
import mintImg from '../assets/img/back/Nature_Concept-removebg-preview@2x.png';
import { Col, Row } from 'rsuite';

var limitData = '';
var createTokenPanel;
var valCreateTokenSTate = false;
var receiverAddress;
var netFeeValue;

function toFixed(x) {
	if (Math.abs(x) < 1.0) {
		var e = parseInt(x.toString().split('e-')[1]);
		if (e) {
			x *= Math.pow(10, e - 1);
			x = '0.' + new Array(e).join('0') + x.toString().substring(2);
		}
	} else {
		var e = parseInt(x.toString().split('+')[1]);
		if (e > 20) {
			e -= 20;
			x /= Math.pow(10, e);
			x += new Array(e + 1).join('0');
		}
	}
	return x;
}

class CreateToken extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tokenAddress: '',
			tokenType: 'StandardToken',
			tokenName: '',
			symbol: '',
			decimals: '',
			totalSupply: '',
			marketAddress: '',
			marketFee: '',
			taxFee: '',
			taxLiquidity: '',
			formErrors: {
				marketAddress: '',
				marketFee: '',
				taxFee: '',
				taxLiquidity: '',
				tokenType: '',
				tokenName: '',
				symbol: '',
				decimals: '',
				totalSupply: ''
			},

			tokenTypeValid: false,
			tokenNameValid: false,
			symbolValid: false,
			decimalsValid: false,
			marketAddressValid: false,
			marketFeeValid: false,
			taxFeeValid: false,
			taxLiquidityValid: false,
			formValid: false
		};

		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		this.props.getEscrowAddress();
		this.props.getNetFeeValueToken();
		window.scrollTo(0, 0);
	}

	onSubmit(e) {
		e.preventDefault();

		valCreateTokenSTate = true;

		const tokenType = this.state.tokenType;
		const tokenName = this.state.tokenName;
		const symbol = this.state.symbol;
		const decimals = this.state.decimals;
		const totalSupply = this.state.totalSupply;
		const marketAddress = this.state.marketAddress;
		const marketFee = this.state.marketFee;
		const taxFee = this.state.taxFee;
		const taxLiquidity = this.state.taxLiquidity;

		if (window.localStorage.getItem('isAuthenticated') === 'true') {
			const userAddress = window.localStorage.getItem('userAddress');
			const chainID = window.localStorage.getItem('chainId');
			var tokenFee = 0;
			var RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

			switch (chainID) {
				case '56':
					tokenFee = Number(netFeeValue.data.BSC);
					RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
					break;
				case '97':
					tokenFee = Number(netFeeValue.data.BSCTest);
					break;
				case '1':
					tokenFee = Number(netFeeValue.data.ETH);
					break;
				case '3':
					tokenFee = Number(netFeeValue.data.Ropsten);
					break;
				case '25':
					tokenFee = Number(netFeeValue.data.Cronos);
					break;
				case '941':
					tokenFee = Number(netFeeValue.data.PulseTest);
					break;
				case '43114':
					tokenFee = Number(netFeeValue.data.Avalanche);
					break;
				case '43113':
					tokenFee = Number(netFeeValue.data.AvalancheTest);
					break;
				case '137':
					tokenFee = Number(netFeeValue.data.Polygon);
					break;
				default:
					tokenFee = 0.15;
			}

			const web3 = new Web3(Web3.givenProvider);

			if (this.state.tokenType === 'StandardToken') {
				axios
					.get(`/api/getTokenContractAbi`)
					.then(async (res) => {
						const abi = res.data;
						axios
							.get(`/api/getTokenContractBytecode`)
							.then(async (res) => {
								const bytecode = res.data.object;
								const deploy_contract = new web3.eth.Contract(abi);

								let payload = {
									data: '0x' + bytecode,
									arguments: [
										tokenName,
										symbol,
										decimals,
										String(toFixed(totalSupply * 10 ** decimals)),
										receiverAddress,
										// web3.utils.toWei(String(0.01), 'ether')
										web3.utils.toWei(String(tokenFee), 'ether')
									]
								};

								let parameter = {
									from: userAddress,
									value: web3.utils.toWei(String(tokenFee), 'ether')
								};

								deploy_contract
									.deploy(payload)
									.send(parameter, (err, transactionHash) => {
										console.log('Transaction Hash :', transactionHash);
									})
									.on('confirmation', () => {})
									.then((newContractInstance) => {
										this.setState({
											tokenAddress: newContractInstance.options.address
										});
										window.localStorage.setItem(
											'tokenAddress',
											newContractInstance.options.address
										);
										window.location.href = `/TokenRes`;
									});
							})
							.catch((err) => console.log(err));
					})
					.catch((err) => console.log(err));
			} else {
				axios
					.get(`/api/getLiquidityTokenContractAbi`)
					.then(async (res) => {
						const abi = res.data;
						axios
							.get(`/api/getLiquidityTokenContractBytecode`)
							.then(async (res) => {
								const bytecode = res.data.object;
								const deploy_contract = new web3.eth.Contract(abi);

								let payload = {
									data: '0x' + bytecode,
									arguments: [
										tokenName,
										symbol,
										
										decimals,
										String(toFixed(totalSupply * 10 ** decimals)),
										RouterAddress,
										marketAddress,
										taxFee,
										taxLiquidity,
										marketFee,
										receiverAddress,
										// web3.utils.toWei(String(0.01), 'ether')
										web3.utils.toWei(String(tokenFee), 'ether')
									]
								};

								let parameter = {
									from: userAddress,
									value: web3.utils.toWei(String(tokenFee), 'ether')
								};

								deploy_contract
									.deploy(payload)
									.send(parameter, (err, transactionHash) => {
										console.log('Transaction Hash :', transactionHash);
									})
									.on('confirmation', () => {})
									.then((newContractInstance) => {
										this.setState({
											tokenAddress: newContractInstance.options.address
										});
										window.localStorage.setItem(
											'tokenAddress',
											newContractInstance.options.address
										);
										window.location.href = `/TokenRes`;
									});
							})
							.catch((err) => console.log(err));
					})
					.catch((err) => console.log(err));
			}
		} else {
			alert('You must connect a wallet!');
		}
		valCreateTokenSTate = false;
	}

	handleInput(e) {
		const name = e.target.name;
		const value = e.target.value;

		this.setState({ [name]: value }, () => {
			this.validateField(name, value);
		});
	}

	validateField(fieldName, value) {
		let fieldValidationErrors = this.state.formErrors;

		let tokenNameValid = this.state.tokenNameValid;
		let symbolValid = this.state.symbolValid;
		let decimalsValid = this.state.decimalsValid;
		let totalSupplyValid = this.state.totalSupplyValid;

		let marketAddressValid = this.state.marketAddressValid;
		let marketFeeValid = this.state.marketFeeValid;
		let taxFeeValid = this.state.taxFeeValid;
		let taxLiquidityValid = this.state.taxLiquidityValid;

		switch (fieldName) {
			case 'tokenName':
				tokenNameValid = !isEmpty(value) ? true : false;
				fieldValidationErrors.tokenName = tokenNameValid ? '' : ' is invalid';
				break;
			case 'symbol':
				symbolValid = !isEmpty(value) ? true : false;
				fieldValidationErrors.symbol = symbolValid ? '' : ' is invalid';
				break;
			case 'decimals':
				decimalsValid = value > 0;
				fieldValidationErrors.decimals = decimalsValid ? '' : ' is invalid';
				break;
			case 'totalSupply':
				totalSupplyValid = value > 0;
				fieldValidationErrors.totalSupply = totalSupplyValid ? '' : ' is invalid';
				break;
			case 'marketAddress':
				marketAddressValid = !isEmpty(value) ? true : false;
				fieldValidationErrors.marketAddress = marketAddressValid ? '' : ' is invalid';
				break;
			case 'marketFee':
				marketFeeValid = value > 0;
				fieldValidationErrors.marketFee = marketFeeValid ? '' : ' is invalid';
				break;
			case 'taxFee':
				taxFeeValid = value > 0;
				fieldValidationErrors.taxFee = taxFeeValid ? '' : ' is invalid';
				break;
			case 'taxLiquidity':
				taxLiquidityValid = value > 0;
				fieldValidationErrors.taxLiquidity = taxLiquidityValid ? '' : ' is invalid';
				break;
			default:
				break;
		}

		this.setState(
			{
				formErrors: fieldValidationErrors,
				tokenNameValid: tokenNameValid,
				symbolValid: symbolValid,
				decimalsValid: decimalsValid,
				totalSupplyValid: totalSupplyValid,
				marketAddressValid: marketAddressValid,
				marketFeeValid: marketFeeValid,
				taxFeeValid: taxFeeValid,
				taxLiquidityValid: taxLiquidityValid
			},
			this.validateForm
		);
	}

	validateForm() {
		if (this.state.tokenType === 'StandardToken') {
			this.setState({
				formValid:
					this.state.tokenNameValid &&
					this.state.symbolValid &&
					this.state.decimalsValid &&
					this.state.totalSupplyValid
			});
		} else {
			this.setState({
				formValid:
					this.state.tokenNameValid &&
					this.state.symbolValid &&
					this.state.decimalsValid &&
					this.state.marketAddressValid &&
					this.state.marketFeeValid &&
					this.state.taxFeeValid &&
					this.state.taxLiquidityValid &&
					this.state.totalSupplyValid
			});
		}
	}

	render() {
		if (this.props.auth.escrowAddress !== undefined) {
			const { escrowAddress } = this.props.auth.escrowAddress.data;
			const { netFeeToken } = this.props.auth;

			receiverAddress = escrowAddress;

			netFeeValue = netFeeToken;

			if (netFeeValue !== undefined) {
				switch (window.localStorage.getItem('chainId')) {
					case '1':
						limitData = netFeeValue.data.ETH + ' ETH';
						break;
					case '3':
						limitData = netFeeValue.data.Ropsten + ' ETH';
						break;
					case '56':
						limitData = netFeeValue.data.BSC + ' BNB';
						break;
					case '97':
						limitData = netFeeValue.data.BSCTest + ' tBNB';
						break;
					case '43114':
						limitData = netFeeValue.data.Avalanche + ' AVAX';
						break;
					case '43113':
						limitData = netFeeValue.data.AvalancheTest + ' tAVAX';
						break;
					case '25':
						limitData = netFeeValue.data.Cronos + ' CRO';
						break;
					case '941':
						limitData = netFeeValue.data.PulseTest + ' tPLS';
						break;
					case '137':
						limitData = netFeeValue.data.Polygon + ' MATIC';
						break;
					default:
						limitData = '0.3 BNB';
						break;
				}
			}
		}
		if (valCreateTokenSTate) {
			createTokenPanel = <Spinner />;
		} else {
			createTokenPanel = (
				<form onSubmit={this.onSubmit}>
					<div className="field">
						<label htmlFor="decimals" id="token-text2">
							Token Type<sup className="has-text-danger">*</sup>
						</label>
						<div className="control">
							<select
								value={this.state.tokenType}
								onChange={(event) => this.handleInput(event)}
								className="token-selected-input"
								name="tokenType"
								placeholder="Standard Token"
							>
								<option value="StandardToken">StandardToken</option>
								<option value="LiquidityToken">LiquidityToken</option>
							</select>
							<div className="invalid-feedback">{this.state.formErrors.tokenType}</div>
						</div>
					</div>
					{this.state.tokenType === 'StandardToken' ? (
						<div>
							<Row>
								<Col md={12} xs={24}>
									<div className="field">
										<label htmlFor="tokenName" id="token-text">
											Name<sup className="has-text-danger">*</sup>
										</label>
										<div className="control">
											<input
												label="Standard"
												value={this.state.tokenName}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.tokenName
												})}
												type="text"
												id="tokenName"
												name="tokenName"
												placeholder="Ex: Ethereum"
												maxLength="255"
											/>
											<div className="invalid-feedback">{this.state.formErrors.tokenName}</div>
										</div>
									</div>
								</Col>
								<Col md={12} xs={24}>
									<div className="field">
										<label htmlFor="symbol" id="token-text">
											Symbol<sup className="has-text-danger">*</sup>
										</label>
										<div className="control">
											<input
												value={this.state.symbol}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.symbol
												})}
												type="text"
												id="tokenName"
												name="symbol"
												placeholder="Ex: ETH"
												maxLength="255"
											/>

											<div className="invalid-feedback">{this.state.formErrors.symbol}</div>
										</div>
									</div>
								</Col>
							</Row>
							<Row>
								<Col md={12} xs={24}>
									<div className="field">
										<label htmlFor="decimals" id="token-text">
											Decimals<sup className="has-text-danger">*</sup>
										</label>
										<div className="control">
											<input
												value={this.state.decimals}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.decimals
												})}
												type="text"
												id="tokenName"
												name="decimals"
												placeholder="Ex: 18"
											/>

											<div className="invalid-feedback">{this.state.formErrors.decimals}</div>
										</div>
									</div>
								</Col>
								<Col md={12} xs={24}>
									<div className="field">
										<label htmlFor="totalSupply" id="token-text">
											Total supply<sup className="has-text-danger">*</sup>
										</label>
										<div className="control">
											<input
												value={this.state.totalSupply}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.totalSupply
												})}
												type="text"
												id="tokenName"
												name="totalSupply"
												placeholder="Ex: 100000000000"
											/>

											<div className="invalid-feedback">{this.state.formErrors.totalSupply}</div>
										</div>
									</div>
								</Col>
							</Row>
						</div>
					) : (
						<div>
							<Row>
								<Col md={12} xs={24}>
									<div className="field">
										<label htmlFor="tokenName" id="token-text">
											Name<sup className="has-text-danger">*</sup>
										</label>
										<div className="control">
											<input
												label="Standard"
												value={this.state.tokenName}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.tokenName
												})}
												type="text"
												id="tokenName"
												name="tokenName"
												placeholder="Ex: Ethereum"
												maxLength="255"
											/>
											<div className="invalid-feedback">{this.state.formErrors.tokenName}</div>
										</div>
									</div>
								</Col>
								<Col md={12} xs={24}>
									<div className="field">
										<label htmlFor="symbol" id="token-text">
											Symbol<sup className="has-text-danger">*</sup>
										</label>
										<div className="control">
											<input
												value={this.state.symbol}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.symbol
												})}
												type="text"
												id="tokenName"
												name="symbol"
												placeholder="Ex: ETH"
												maxLength="255"
											/>

											<div className="invalid-feedback">{this.state.formErrors.symbol}</div>
										</div>
									</div>
								</Col>
							</Row>
							<Row>
								<Col md={12} xs={24}>
									<div className="field">
										<label htmlFor="decimals" id="token-text">
											Decimals<sup className="has-text-danger">*</sup>
										</label>
										<div className="control">
											<input
												value={this.state.decimals}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.decimals
												})}
												type="text"
												id="tokenName"
												name="decimals"
												placeholder="Ex: 18"
											/>

											<div className="invalid-feedback">{this.state.formErrors.decimals}</div>
										</div>
									</div>
								</Col>
								<Col md={12} xs={24}>
									<div className="field">
										<label htmlFor="totalSupply" id="token-text">
											Total supply<sup className="has-text-danger">*</sup>
										</label>
										<div className="control">
											<input
												value={this.state.totalSupply}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.totalSupply
												})}
												type="text"
												id="tokenName"
												name="totalSupply"
												placeholder="Ex: 100000000000"
											/>

											<div className="invalid-feedback">{this.state.formErrors.totalSupply}</div>
										</div>
									</div>
								</Col>
							</Row>
							<Row>
								<Col md={12} xs={24}>
									<div className="field">
										<label htmlFor="marketAddress" id="token-text">
											Charity/Marketing address<sup className="has-text-danger">*</sup>
										</label>
										<div className="control">
											<input
												value={this.state.marketAddress}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.marketAddress
												})}
												type="text"
												id="tokenName"
												name="marketAddress"
												placeholder="Ex: 0x23213..."
											/>

											<div className="invalid-feedback">
												{this.state.formErrors.marketAddress}
											</div>
										</div>
									</div>
								</Col>
								<Col md={12} xs={24}>
									<div className="field">
										<label htmlFor="marketFee" id="token-text">
											Charity/Marketing percent (%)<sup className="has-text-danger">*</sup>
										</label>
										<div className="control">
											<input
												value={this.state.marketFee}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.marketFee
												})}
												type="text"
												id="tokenName"
												name="marketFee"
												placeholder="Ex: 0~25"
											/>

											<div className="invalid-feedback">{this.state.formErrors.marketFee}</div>
										</div>
									</div>
								</Col>
							</Row>
							<Row>
								<Col md={12} xs={24}>
									<div className="field">
										<label htmlFor="taxFee" id="token-text">
											Transaction fee to generate yield (%)<sup className="has-text-danger">*</sup>
										</label>
										<div className="control">
											<input
												value={this.state.taxFee}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.taxFee
												})}
												type="text"
												id="tokenName"
												name="taxFee"
												placeholder="Ex:1"
											/>

											<div className="invalid-feedback">{this.state.formErrors.taxFee}</div>
										</div>
									</div>
								</Col>
								<Col md={12} xs={24}>
									<div className="field">
										<label htmlFor="taxLiquidity" id="token-text">
											Charity/Marketing percent (%)<sup className="has-text-danger">*</sup>
										</label>
										<div className="control">
											<input
												value={this.state.taxLiquidity}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.taxLiquidity
												})}
												type="text"
												id="tokenName"
												name="taxLiquidity"
												placeholder="Ex: 1"
											/>

											<div className="invalid-feedback">{this.state.formErrors.taxLiquidity}</div>
										</div>
									</div>
								</Col>
							</Row>
						</div>
					)}
					<div className="has-text-centered mt-6 pt-4 mb-4">
						<button
							type="submit"
							className="token-button"
							onClick={this.onSubmit}
							disabled={!this.state.formValid}
						>
							<stron>NEXT</stron>
						</button>
					</div>
					<p className="token-info">Create token fee: {limitData}</p>
				</form>
			);
		}
		return (
			<div className="py-6 container">
				<div style={{ height: '16px' }} />

				<div className="bg-dark  style-border ant-card ant-card-bordered">
					<div className="ant-card-body" id="createToken">
						<div className="lead2" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
							<Row>
								<Col md={12} xs={24}>
									<h1 className="text-center" style={{ fontSize: '40px' }}>
										CREATE TOKEN
										<img
											src={mintImg}
											alt="mint image "
											style={{
												height: '20px',
												width: '20px',
												marginTop: '-35px'
											}}
										/>
									</h1>
									<h4 style={{ color: '#FFAA00' }}>All fields below are required</h4>
								</Col>
								<Col md={12} xs={24}>
									<img src={mintImg} alt="mint image" style={{ width: '100px', height: '100px' }} />
								</Col>
							</Row>
						</div>
						<br />
						<br />
						<br />
						<div className="lead2">{createTokenPanel}</div>
					</div>
				</div>
			</div>
		);
	}
}

CreateToken.propTypes = {
	getEscrowAddress: PropTypes.func.isRequired,
	getNetFeeValueToken: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
		errors: state.errors
	};
};

export default connect(mapStateToProps, { getEscrowAddress, getNetFeeValueToken })(CreateToken);
