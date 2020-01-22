import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app';

import { Auth, Analytics, ServiceWorker } from 'aws-amplify';
await serviceWorker.register('/serviceWorker.js', '/');
serviceWorker.enablePush('AAAAkid8Fy4:APA91bGyhaZQIiimsHsUfFswAcKyJ6GII7hmr_wH09EVjGMv7t04eWfYG98HJLRU07KoNybUUXfLjzRvKYsD61Gb7K-oW88ezqOAv3lRlLs0zKFP_O5k0Myjb5MYn5ZvbXbPIWH-qBkx');

import AWSAppSyncClient, { AUTH_TYPE, createAppSyncLink, createLinkWithCache } from 'aws-appsync';
import awsexports from './aws-exports';
import { ApolloProvider } from 'react-apollo';

import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';

const stateLink = createLinkWithCache(cache => withClientState({ cache, resolvers: {}, }));
const awsAppSyncLink = createAppSyncLink({
    url: awsexports.aws_appsync_graphqlEndpoint,
    region: awsexports.aws_appsync_region,
    auth: {
        type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
        jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
    },
    complexObjectsCredentials: () => Auth.currentCredentials()
});
const link = ApolloLink.from([stateLink, awsAppSyncLink]);
const client = new AWSAppSyncClient({}, { link });

Analytics.autoTrack('session', {
    enable: true,
    provider: 'AWSPinpoint'
});

Analytics.autoTrack('pageView', {
    enable: true,
    eventName: 'pageView',
    type: 'SPA',
    provider: 'AWSPinpoint',
    getUrl: () => {
        return window.location.origin + window.location.pathname;
    }
});

Analytics.autoTrack('event', {
    enable: true,
    events: ['click'],
    selectorPrefix: 'data-amplify-analytics-',
    provider: 'AWSPinpoint'
});

const analyticsConfig = {
    AWSPinpoint: {
          // Amazon Pinpoint App Client ID
          appId: '2a7aa42f825844c09aa3c8db1b038843',
          // Amazon service region
          region: 'us-west-2',
          mandatorySignIn: false,
    }
  }
  
  Analytics.configure(analyticsConfig)

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

serviceWorker.register();