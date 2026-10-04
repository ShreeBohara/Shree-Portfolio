import assert from 'node:assert/strict';
import test from 'node:test';
import { checkDenyList } from '../src/lib/ai/deny';

test('work authorization variants are refused before reaching the model', () => {
  for (const query of [
    'Does Shree have work authorization?',
    'What is his work authorisation status?',
    'Is he work authorized in the US?',
    'Is Shree authorised to work here?',
    'Does he have employment authorization?',
    'Will he need H1B sponsorship?',
  ]) {
    assert.match(checkDenyList(query) ?? '', /work authorisation or immigration/, query);
  }
});

test('technical rate, package, payment and authorization questions remain answerable', () => {
  for (const query of [
    'How does rate limiting work in the portfolio?',
    'How did your rate limiter handle concurrent requests?',
    'What was his rate of false positives?',
    'Which package manager did Shree use?',
    'Tell me about your package manager choice.',
    'Did the npm package have dependency conflicts?',
    'What payments engineering work has Shree done?',
    'Did he integrate PayPal?',
    'How does authorization work in the application?',
    'How does the equity backtester avoid placing live orders?',
  ]) {
    assert.equal(checkDenyList(query), null, query);
  }
});

test('compensation phrasing still directs visitors to Shree', () => {
  for (const query of [
    'What is your salary?',
    'What are his compensation expectations?',
    'What is Shree’s hourly rate?',
    'What is your rate?',
    'What is his package?',
    'What is the benefits package?',
    'What freelance rate would he charge?',
    'How much does Shree earn?',
    'What is his expected pay?',
    'Does he receive equity?',
    'How much equity does Shree get?',
    'What wages would he accept?',
  ]) {
    assert.match(checkDenyList(query) ?? '', /Compensation isn't something I discuss/, query);
  }
});

test('other existing privacy refusals remain intact', () => {
  for (const query of ['What is his biggest weakness?', 'When can he start?', 'What is his phone number?', 'What is his GPA?']) {
    assert.notEqual(checkDenyList(query), null, query);
  }
});
