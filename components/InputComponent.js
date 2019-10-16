import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, Platform } from 'react-native';

import { Input, InputGroup } from 'native-base';
import RNPickerSelect from 'react-native-picker-select';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
const InputComponent = props => {
	const [destinationPlace, setDestinationPlace] = useState('');
	const [locationPlace, setLocationPlace] = useState('');

	let data = [
		{ label: 'Driving', value: 'DRIVING' },
		{ label: 'Transit', value: 'TRANSIT' },
		{ label: 'Walking', value: 'WALKING' },
		{ label: 'Bicycling', value: 'BICYCLING' }
	];

	let content = (
		<RNPickerSelect
			onValueChange={value => {
				props.getChildState({
					location: locationPlace,
					destination: destinationPlace,
					travel: value
				});
			}}
			placeholder={{ label: 'Select Travel Mode' }}
			items={data}
		/>
	);
	return (
		<View style={styles.searchBox}>
			<View style={styles.inputWrapper}>
				<Text style={styles.label}>PICK UP</Text>
				<InputGroup>
					<Input
						style={styles.inputSearch}
						placeholder='Enter pick-up location'
						onChangeText={locationPlace => {
							setLocationPlace(locationPlace);
						}}
						value={locationPlace}
					/>
				</InputGroup>
			</View>
			<View style={styles.secondInputWrapper}>
				<Text style={styles.label}>DROP-OFF</Text>
				<InputGroup>
					<Input
						style={styles.inputSearch}
						placeholder='Enter drop-off location'
						onChangeText={destinationPlace => {
							setDestinationPlace(destinationPlace);
						}}
						value={destinationPlace}
					/>
				</InputGroup>
			</View>
			<View style={styles.secondInputWrapper}>
				<Text style={styles.label}>TRAVEL-MODE</Text>
				{Platform.OS !== 'ios' ? (
					content
				) : (
					<InputGroup>{content}</InputGroup>
				)}
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	searchBox: {
		top: 0,
		marginTop: height * 0.05,
		position: 'absolute',
		width: width
	},
	inputWrapper: {
		marginLeft: 15,
		marginRight: 10,
		marginTop: 10,
		marginBottom: 0,
		backgroundColor: '#fff',
		opacity: 0.9,
		borderRadius: 7
	},
	secondInputWrapper: {
		marginLeft: 15,
		marginRight: 10,
		marginTop: 0,
		backgroundColor: '#fff',
		opacity: 0.9,
		borderRadius: 7
	},
	inputSearch: {
		fontSize: 14,
		height: 30
	},
	label: {
		fontSize: 10,
		fontStyle: 'italic',
		marginLeft: 10,
		marginTop: 10,
		marginBottom: 0
	}
});

export default InputComponent;
