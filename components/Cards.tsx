import React from "react";
import { Text ,View, StyleSheet } from 'react-native';
import {Card, Button , Title ,Paragraph } from 'react-native-paper';
import GlobalArraySingleton from '../pages/GlobalArraySingleton';
import {LineChart} from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const CreateCard = ({prop}) => {
	
    const data = {
    labels: prop.dataLabels.reverse(),
    datasets: [{data: prop.dataValue.reverse()}]};

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 1,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

	return(
		<Card style={Styles.container}>
        <Card.Content>
            <View>
            <Text style={Styles.text}>Summary of the total collected data</Text>
            <LineChart
                accessible={true}
                accessibilityLabel="Line chart showing data trends over time"
                data={data}
                width={Dimensions.get("window").width - 40} // from react-native
                height={180}
                yAxisLabel="#"
                // yAxisSuffix="k"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                backgroundColor: "#ffffff",

                // change color
                // backgroundGradientFrom: "#02BFB1",
                // backgroundGradientTo: "#02BFB1",

                backgroundGradientFrom: "#127ACC",
                backgroundGradientTo: "#127ACC",

                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                },
                propsForDots: {
                    r: "6",
                    strokeWidth: "3",
                    stroke: "#ffa726"
                }
                }}
                bezier
                style={{
                marginVertical: 8,
                borderRadius: 16
                }} 
            />
            </View>
        </Card.Content>
{/* 		
        <Card.Cover source={{ uri: 'https://media.geeksforgeeks.org/wp-content/uploads/20220217151648/download3-200x200.png' }} /> */}

        <Card.Content>
            <View style={Styles.sessionContainer}>
                <Text>Total Sessions: {prop.totalSessions}</Text> 
                {/* <Text style={Styles.textRight}>Distance Covered: </Text> */}
            </View>
        </Card.Content>
	</Card>
	)
}
export default CreateCard;

const Styles = StyleSheet.create({
	container :{
		alignContent:'center',
		margin:7,
        backgroundColor: '#F5FCFF',
	},
    text: {
        fontSize: 18,
    },
    sessionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textRight: {
        textAlign: 'right', // Align the text to the right
    },
})
