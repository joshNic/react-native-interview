import React, { Component } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import InputComponent from './InputComponent';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

//Supply your own google maps API key
const GOOGLE_MAPS_APIKEY = process.env['API_KEY_GOOGLE'];

//Supply your own OpenCagedata API key
const OPENCAGEDATA_API = process.env['API_KEY_OPEN'];

export default class MapComponent extends Component {
	state = {
		region: {
			latitude: 1.373333,
			longitude: 32.290275,
			latitudeDelta: 3.0,
			longitudeDelta: 1.5
		},
		data: {}
	};

	verifyPermissions = async () => {
		const result = await Permissions.askAsync(Permissions.LOCATION);
		if (result.status !== 'granted') {
			Alert.alert(
				'Insufficient permissions!',
				'You need to grant location permissions to use this app.',
				[{ text: 'Okay' }]
			);
			return false;
		}
		return true;
	};

	getLocationHandler = async () => {
		const hasPermission = await this.verifyPermissions();
		if (!hasPermission) {
			return;
		}
		try {
			const location = await Location.getCurrentPositionAsync({
				timeout: 5000
			});
			this.setState({
				region: {
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					latitudeDelta: 3.0,
					longitudeDelta: 1.5
				}
			});
		} catch (err) {
			Alert.alert(
				'Could not fetch location!',
				'Please try again later or pick a location on the map.',
				[{ text: 'Okay' }]
			);
		}
	};

	//Uncomment the method below if you are not using emulator (because the emulator by default zooms to san-fran)

	/*componentDidMount() {
		this.getLocationHandler().then(() => console.log('loaded'));
	}*/

	getCoodinates = async place => {
		api_url = 'https://api.opencagedata.com/geocode/v1/json';
		var request_url =
			api_url +
			'?' +
			'key=' +
			OPENCAGEDATA_API +
			'&q=' +
			encodeURIComponent(`${place},uganda`) +
			'&pretty=1' +
			'&no_annotations=1' +
			'&limit=1';
		let response = await fetch(request_url);
		let user = await response.json();
		let formated = {
			latitude: user.results[0].geometry.lat,
			longitude: user.results[0].geometry.lng
		};
		return formated;
	};

	getChildState = data => {
		this.setState({ mode: data.travel });
		this.getCoodinates(data.location).then(loc =>
			this.setState({ location: loc })
		);
		this.getCoodinates(data.destination).then(des =>
			this.setState({ destination: des })
		);
	};

	render() {
		return (
			<View style={styles.container}>
				<MapView
					region={this.state.region}
					style={styles.mapStyle}
					loadingEnabled={true}
				>
					<MapViewDirections
						origin={this.state.location}
						destination={this.state.destination}
						apikey={GOOGLE_MAPS_APIKEY}
						mode={this.state.mode}
						strokeWidth={4}
						strokeColor='blue'
					/>
				</MapView>
				<InputComponent getChildState={this.getChildState} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	mapStyle: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height
	}
});
