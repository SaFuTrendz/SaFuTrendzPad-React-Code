import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Marquee from 'react-fast-marquee';
import trendingImage from '../assets/img/back/trend.svg';
import { getAllData } from '../../actions/padActions';

let marqueeData1, marqueeData2;
function Header2() {
	const dispatch = useDispatch();
	const padList = useSelector((state) => state.pad.pads);

	useEffect(() => {
		dispatch(getAllData());
	}, []);

	useEffect(() => {
		dispatch(getAllData());
		setTrendingMarqueeData();
	});

	const setTrendingMarqueeData = () => {
		if (padList.length !== 0) {
			const buf1 = [ ...padList ];

			let result = buf1.sort((a, b) => b.saleCount - a.saleCount);
			result = result.slice(0, 10);
			let buf3 = result.map((res, i) => {
				return (
					<a href={`/PadInfo/${res.presaleAddress}`} key={i}>
						<div>
							🔥{i + 1}:<img src={res.logoUrl} alt="logourl" height={20} width={20} /> {res.title}&nbsp;&nbsp;&nbsp;&nbsp;{'||'}&nbsp;&nbsp;&nbsp;&nbsp;
						</div>
					</a>
				);
			});

			const buf2 = [ ...padList ];
			let buf4 = buf2.map((res, i) => {
				return res.advertise ? (
					<a href={`/PadInfo/${res.presaleAddress}`} key={i}>
						<div>
							💖<img src={res.logoUrl} alt="logourl" height={20} width={20} /> {res.title}&nbsp;&nbsp;&nbsp;&nbsp;{'||'}&nbsp;&nbsp;&nbsp;&nbsp;
						</div>
					</a>
				) : (
					''
				);
			});

			marqueeData1 = buf3;
			marqueeData2 = buf4;
		}
	};

	return (
		<div>
			<div style={{ marginTop: '-10px' }}>
				<div style={{ zIndex: '1' }}>
					<Marquee pauseOnHover={true} gradient={false} speed={30} className="marquee-1">
						{marqueeData1}
					</Marquee>
				</div>
				<div className="marquee-tranding has-text-left">
					<img src={trendingImage} alt="trending image" height={20} /> TRENDING
				</div>
			</div>
			<div style={{ marginLeft: '3%', marginRight: '3%' }}>
				<Marquee pauseOnHover gradient={false} className="marquee-advertise">
					{marqueeData2}
				</Marquee>
			</div>
		</div>
	);
}

export default Header2;
