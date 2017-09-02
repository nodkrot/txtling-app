import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StatusBar } from 'react-native';
import Swiper from 'react-native-swiper';
import { ROUTES } from '../../constants/AppConstants';
import { LinkButton, Button } from '../Elements';
import styles from './styles';

const onboarding1 = require('../../images/onboarding1.png');
const onboarding2 = require('../../images/onboarding2.png');
const onboarding3 = require('../../images/onboarding3.png');

class IntroView extends Component {
    static displayName = 'IntroView'

    static propTypes = {
        navigator: PropTypes.object
    }

    componentWillMount = () => {
        StatusBar.setBarStyle('default');
    }

    handleNext = () => {
        this.refs.swiper.scrollBy(1);
    }

    handeGetStarted = () => {
        this.props.navigator.push({
            id: ROUTES.phoneView
        });
    }

    renderDot = () => <View style={styles.dot} />

    renderActiveDot = () => <View style={[styles.dot, styles.activeDot]} />

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
                    <View style={styles.slide}>
                        <Image style={styles.slideImage} resizeMode="contain" source={onboarding1} />
                        <Text style={styles.logoText}>txtling</Text>
                        <Text style={styles.text}>Learn new languages by texting</Text>
                        <Text style={styles.text}>with your friends</Text>
                        <LinkButton text="Next"
                            icon="ios-arrow-forward"
                            onPress={this.handleNext}
                            style={styles.nextButton} />
                    </View>
                    <View style={styles.slide}>
                        <Image style={styles.slideImage} resizeMode="contain" source={onboarding2} />
                        <Text style={styles.titleText}>Discover</Text>
                        <Text style={styles.text}>Invite your friends and start texting</Text>
                        <Text style={styles.text}>them. The message will be translated to</Text>
                        <Text style={styles.text}>the language you want to learn.</Text>
                        <LinkButton text="Next"
                            icon="ios-arrow-forward"
                            onPress={this.handleNext}
                            style={styles.nextButton} />
                    </View>
                    <View style={styles.slide}>
                        <Image style={styles.slideImage} resizeMode="contain" source={onboarding3} />
                        <Text style={styles.titleText}>Learn</Text>
                        <Text style={styles.text}>Tap on the message to see the</Text>
                        <Text style={styles.text}>translation. Pro tip! Tap the sound icon</Text>
                        <Text style={styles.text}>for audio.</Text>
                        <View style={styles.buttonWrap}>
                            <Button text="Get Started"
                                onPress={this.handeGetStarted}
                                icon="ios-arrow-forward" />
                        </View>
                    </View>
                </Swiper>
            </View>
        );
    }
}

export default IntroView;
