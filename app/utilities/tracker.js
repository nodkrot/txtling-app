import { GOOGLE_TRACKING_ID } from '../constants/AppConstants.js';
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';

export default new GoogleAnalyticsTracker(GOOGLE_TRACKING_ID);
