/* eslint-disable no-new, no-unused-vars */
import test from 'ava';
import routes from '../../../src/routes'; // to aviod circular dependencies
import PassengerIndex from '../../../src/actions/menu/passenger/index';
import { i18n } from '../../spec-support';

const user = {};

test('can be constructed with default parameters', t => {
  new PassengerIndex({ i18n, user });
  t.pass();
});

test('should return composite response on get', t => {
  const action = new PassengerIndex({ i18n, user });
  const response = action.get();
  t.is(response.type, 'composite');
  t.is(response.responses[0].type, 'text');
  t.is(response.responses[0].message, i18n.__('passenger-index.choose_taxi_type'));
  t.is(response.responses[1].type, 'options');
  t.is(response.responses[1].rows[0][0].value, 'bike');
  t.is(response.responses[1].rows[0][1].value, 'car');
  t.is(response.responses[1].rows[0][2].value, 'settings');
  t.is(response.responses[1].rows[0][0].label, i18n.__('passenger-index.bike'));
  t.is(response.responses[1].rows[0][1].label, i18n.__('passenger-index.car'));
  t.is(response.responses[1].rows[0][2].label, i18n.__('passenger-index.s'));
});

test('should return composite response on post for bike and car', t => {
  const reactions = ['bike', 'car'];
  const action = new PassengerIndex({ i18n, user });

  for (const reaction of reactions) {
    const response = action.post(reaction);
    t.is(response.type, 'composite');
    t.is(response.responses[0].type, 'text');
    t.is(response.responses[0].message, '👌 OK!');
    t.is(response.responses[1].type, 'user-state');
    t.is(response.responses[1].state.taxiType, reaction);
    t.is(response.responses[2].type, 'redirect');
    t.is(response.responses[2].path, 'passenger-request-location');
  }
});

test('should return different composite response on post for settings', t => {
  const action = new PassengerIndex({ i18n, user });
  const response = action.post('settings');
  t.is(response.type, 'composite');
  t.is(response.responses[0].type, 'redirect');
  t.is(response.responses[0].path, 'settings');
});

test('should return error on post for unknown reaction', t => {
  const action = new PassengerIndex({ i18n, user });
  const response = action.post('whatever');
  t.is(response.type, 'composite');
  t.is(response.responses[0].type, 'error');
  t.is(response.responses[0].message, i18n.__('passenger-index.error_only_known_type'));
});