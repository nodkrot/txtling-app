import styles from './styles';

import React, { Component, PropTypes } from 'react';
import {
    View,
    Text
} from 'react-native';
// import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { ROUTES } from '../../constants/AppConstants';
import { Button } from '../Form';

class IntroView extends Component {

    constructor() {
        super();

        this.handleNext = this.handleNext.bind(this);
        this.handeGetStarted = this.handeGetStarted.bind(this);
    }

    handleNext() {
        this.refs.swiper.scrollBy(1);
    }

    handeGetStarted() {
        this.props.navigator.push({
            id: ROUTES.phoneView
        });
    }

    render() {
        return (
            <View style={styles.main}>
                <Swiper style={styles.wrapper} loop={false} bounces ref="swiper">
                    <View style={styles.slide1}>
                        <Text style={styles.text}>Hello Swiper</Text>
                        <Button text="Next" type="flat" onPress={this.handleNext} iconRight icon="ios-arrow-forward" />
                    </View>
                    <View style={styles.slide2}>
                        <Text style={styles.text}>Beautiful</Text>
                        <Button text="Next" type="flat" onPress={this.handleNext} iconRight icon="ios-arrow-forward" />
                    </View>
                    <View style={styles.slide3}>
                        <Text style={styles.text}>And simple</Text>
                        <Button text="Get Started" type="flat" onPress={this.handeGetStarted} iconRight icon="ios-arrow-forward" />
                    </View>
                </Swiper>
            </View>
        );
    }
}

IntroView.propTypes = {
    navigator: PropTypes.object
};

// function mapStateToProps(state) {
//     return {};
// }

export default IntroView;
// export default connect(mapStateToProps, {})(IntroView);
