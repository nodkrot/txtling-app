import styles from './styles';

import React, { Component, PropTypes } from 'react';
import { View, Text, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { ROUTES } from '../../constants/AppConstants';
import { Button } from '../Form';
import { LinkButton } from '../Elements';

class IntroView extends Component {

    constructor(props) {
        super(props);

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

    renderDot() {
        return <View style={styles.dot} />;
    }

    renderActiveDot() {
        return <View style={[styles.dot, styles.activeDot]} />;
    }

    render() {
        return (
            <View style={styles.main}>
                <Swiper
                    bounces
                    loop={false}
                    ref="swiper"
                    paginationStyle={styles.pagination}
                    dot={this.renderDot()}
                    activeDot={this.renderActiveDot()}>
                    <View style={styles.slide1}>
                        <Image style={styles.slideImage} resizeMode="contain" source={require('../../images/onboarding1.png')} />
                        <Text style={styles.logoText}>txtling</Text>
                        <Text style={styles.text}>Learn new languages by texting</Text>
                        <Text style={styles.text}>with your friends</Text>
                        <LinkButton text="Next" icon="ios-arrow-forward" onPress={this.handleNext} style={styles.nextButton} />
                    </View>
                    <View style={styles.slide2}>
                        <Image style={styles.slideImage} resizeMode="contain" source={require('../../images/onboarding2.png')} />
                        <Text style={styles.titleText}>Discover</Text>
                        <Text style={styles.text}>Invite your friends and start texting</Text>
                        <Text style={styles.text}>them. The message will be translated to</Text>
                        <Text style={styles.text}>the language you want to learn.</Text>
                        <LinkButton text="Next" icon="ios-arrow-forward" onPress={this.handleNext} style={styles.nextButton} />
                    </View>
                    <View style={styles.slide3}>
                        <Image style={styles.slideImage} resizeMode="contain" source={require('../../images/onboarding3.png')} />
                        <Text style={styles.titleText}>Learn</Text>
                        <Text style={styles.text}>Tap on the message to see the</Text>
                        <Text style={styles.text}>translation. Pro tip! Tap the sound icon</Text>
                        <Text style={styles.text}>for audio.</Text>
                        <Button text="Get Started" onPress={this.handeGetStarted} icon="ios-arrow-forward" />
                    </View>
                </Swiper>
            </View>
        );
    }
}

IntroView.propTypes = {
    navigator: PropTypes.object
};

export default IntroView;
