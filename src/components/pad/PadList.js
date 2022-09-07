import React, { Component } from 'react';
import Pads from './Pads';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPads } from '../../actions/padActions';
import { setAlaramData, getAlaramData } from '../../actions/alarmActions';
import { FlexboxGrid, Col, Row } from 'rsuite';
import SearchInput, { createFilter } from 'react-search-input';
import Spinner from '../common/Spinner';
import launchHeaderImg from '../assets/img/back/lauchpad-img.jfif';
import roketImg from '../assets/img/back/roket.jpg';

const KEYS_TO_FILTERS = [ 'title', 'symbol' ];
const KEY_TO_FAVORITE = [ 'favorite' ];

var items = [];

class PadList extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubButton = this.onSubButton.bind(this);
		this.onChangeState = this.onChangeState.bind(this);

		this.state = {
			kycState: false,
			adtState: false,
			safuState: false,
			prmState: false,
			pvtState: false,
			whiteListState: false,
			currentState: false,
			favoriteState: false,
			upcommingState: false,
			livingState: false,
			faildState: false,
			successState: false,
			cancelState: false,
			finishedState: false,
			searchTerm: ''
		};
	}

	onChange(e) {
		this.setState({
			kycState: false,
			adtState: false,
			safuState: false,
			prmState: false,
			pvtState: false,
			whiteListState: false,
			currentState: false
		});

		this.setState({ [e.target.value]: true });
	}

	onChangeState(e) {
		this.setState({
			upcommingState: false,
			livingState: false,
			faildState: false,
			cancelState: false,
			finishedState: false,
			successState: false
		});

		this.setState({ [e.target.value]: true });
	}

	componentDidMount() {
		window.scrollTo(0, 0);

		setInterval(() => {
			this.props.getPads();
			this.props.getAlaramData({ userAddress: localStorage.getItem('userAddress') });
			this.setState((prevState) => {
				return {};
			});
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval();
	}

	handleChange = (event) => {
		this.setState({
			searchTerm: event
		});
	};

	onSubButton(e) {
		if (localStorage.getItem('isAuthenticated') === 'true') {
			if (e.target.name === 'currentState')
				this.setState({
					currentState: !this.state.currentState
				});
			else {
				this.setState({
					favoriteState: !this.state.favoriteState
				});
			}
		} else {
			alert('Please Connect Wallet!');
		}
	}

	render() {
		const { pad } = this.props.pad;
		const { alarmData } = this.props.alarm;
		var buffer = [];
		let postContent;

		items = pad;
		if (pad.length !== 0) {
			var alarmValue = alarmData.data;

			if (alarmValue === null) alarmValue = [];
			//alarmValue = [];

			const filteredItems = items.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
			if (
				this.state.kycState ||
				this.state.adtState ||
				this.state.whiteListState ||
				this.state.safuState ||
				this.state.prmState ||
				this.state.pvtState ||
				this.state.currentState ||
				this.state.livingState ||
				this.state.upcommingState ||
				this.state.finishedState ||
				this.state.faildState ||
				this.state.favoriteState ||
				this.state.successState
			) {
				filteredItems.map((item) => {
					console.log(item.auditState);
					var nowState;
					var hardCapTime = new Date(item.to);
					var softCapTime = new Date(item.from);
					var nowTime = new Date();
					var bufState = null;

					if (item.presaleState === '3') {
						nowState = 3; //  faild;
					} else if (item.presaleState === '2') {
						nowState = 2; // sucess;
					} else if (softCapTime > nowTime) {
						nowState = 0; // upcomming;
					} else if (hardCapTime < nowTime) {
						if (item.hardCap <= item.saleCount) {
							nowState = 2;
						} else if (item.softCap <= item.saleCount)
							// sucess;
							nowState = 2; // sucess;
						else nowState = 3; // faild;
					} else if (item.saleCount >= item.hardCap) {
						nowState = 4; // finish;
					} else {
						nowState = 1; // live;
					}

					if (this.state.kycState) {
						if (item.kycState) bufState = item;
					} else if (this.state.adtState) {
						if (item.auditState) bufState = item;
					} else if (this.state.whiteListState) {
						if (item.whiteListState) bufState = item;
					} else if (this.state.safuState) {
						if (item.safuState) bufState = item;
					} else if (this.state.prmState) {
						if (item.premium) bufState = item;
					} else if (this.state.pvtState) {
						if (item.privateSale) bufState = item;
					}

					if (this.state.livingState) {
						if (nowState === 1) bufState = item;
					} else if (this.state.faildState) {
						if (nowState === 3) bufState = item;
					} else if (this.state.upcommingState) {
						if (nowState === 0) bufState = item;
					} else if (this.state.finishedState) {
						if (nowState === 4) bufState = item;
					} else if (this.state.successState) {
						if (nowState === 2) bufState = item;
					}

					if (this.state.currentState) {
						if (alarmValue !== []) {
							let buf1 = false;
							if(alarmValue.saleToken !== null){
								if (alarmValue.saleToken.length >= 1)
								for (let i = 0; i < alarmValue.saleToken.length; i++) {
									if (alarmValue.saleToken[i] !== null) {
										if (alarmValue.saleToken[i].tokenAddress === item.tokenAddress) {
											buf1 = true;
										}
									}
								}

							if (buf1) {
								bufState = item;
							}
								
							}
							
							
						}
					}

					if (this.state.favoriteState) {
						if (alarmValue !== []) {
							let buf = false;
							if(alarmValue.saleToken !== null){
							if (alarmValue.favorite.length >= 1)
								for (let i = 0; i < alarmValue.favorite.length; i++) {
									if (alarmValue.favorite[i] !== null) {
										if (alarmValue.favorite[i].tokenAddress === item.tokenAddress) {
											if (alarmValue.favorite[i].favorite) buf = true;
										}
									}
								}

							if (buf) {
								bufState = item;
							}
							}
						}
					}

					if (bufState !== null) buffer.push(bufState);
				});
				postContent = <Pads pads={buffer} alarm={alarmValue} />;
			} else postContent = <Pads pads={filteredItems} alarm={alarmValue} />;
		} else {
			postContent = (
				<div style={{ marginTop: '50px' }}>
					<h3 className="text-center">Connecting to wallet, please wait</h3>
					<Spinner />
				</div>
			);
		}

		return (
			<section className="pt-4">
				<div className="pad-list-main">
					<img
						src={launchHeaderImg}
						alt="launch header image"
						style={{ width: '50rem', height: '30rem', borderRadius: '1rem' }}
					/>
					<div className="bg-dark p-lg-5  white-font rounded-3 text-center">
						<div className="m-4 m-lg-5 ">
							<div className="lead2">
								<div
									className=" fw-bold"
									style={{ fontSize: '45px', marginBottom: '20px', marginTop: '50px' }}
								>
									<b>CURRENT PRESALE</b>
								</div>

								<p className="fs-4 socials" style={{ fontSize: '20px' }}>
									Presale Are Usually Sold In A Separate Allocation Of Sit
								</p>

								<img
									src={roketImg}
									alt="roket image"
									style={{ width: '150px', height: '150px', marginTop: '60px' }}
								/>
							</div>

							<div className="input-group mb-3" style={{ marginTop: '50px', marginBottom: '180px' }}>
								<Row>
									<Col xl={12} xs={24} sm={8}>
										<SearchInput
											className="search-input"
											placeholder="Enter token name or token symbol."
											value={this.state.searchTerm}
											onChange={this.handleChange}
										/>
									</Col>
									<Col xl={6} xs={24} sm={8}>
										{this.state.currentState ? (
											<button
												className="list-button-left"
												name="currentState"
												onClick={this.onSubButton}
											>
												My Contribute
											</button>
										) : (
											<button
												className="list-button-left"
												name="currentState"
												onClick={this.onSubButton}
												style={{ backgroundColor: '#00000000' }}
											>
												My Contribute
											</button>
										)}
										{this.state.favoriteState ? (
											<button
												className="list-button-right"
												name="favoriteState"
												onClick={this.onSubButton}
											>
												My Favorite
											</button>
										) : (
											<button
												className="list-button-right"
												name="favoriteState"
												onClick={this.onSubButton}
												style={{ backgroundColor: '#00000000' }}
											>
												My Favorite
											</button>
										)}
									</Col>
									<Col xl={6} xs={24} sm={8}>
										<select
											id="state"
											className="list-button-left"
											onChange={this.onChange}
											style={{ backgroundColor: '#00000000' }}
										>
											<option value="All status">All Status</option>
											<option value="kycState">KYC</option>
											<option value="adtState">ADT</option>
											<option value="whiteListState">WHT</option>
											<option value="safuState">SAFU</option>
											<option value="prmState">PRM</option>
										</select>
										<select
											id="state1"
											className="list-button-right"
											onChange={this.onChangeState}
											style={{ backgroundColor: '#00000000' }}
										>
											<option value="selectActive">SELECT ACTIVE</option>
											<option value="upcommingState">UPCOMMING</option>
											<option value="livingState">LIVING</option>
											<option value="successState">SUCCESS</option>
											<option value="faildState">FAILD</option>
											<option value="finishedState">FINISHED</option>
										</select>
									</Col>
								</Row>
							</div>
						</div>
					</div>
				</div>
				<FlexboxGrid justify="space-around">{postContent}</FlexboxGrid>
			</section>
		);
	}
}

PadList.propTypes = {
	getPads: PropTypes.func.isRequired,
	pad: PropTypes.object.isRequired,
	alarm: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	pad: state.pad,
	alarm: state.alarm
});

export default connect(mapStateToProps, { getPads, setAlaramData, getAlaramData })(PadList);
