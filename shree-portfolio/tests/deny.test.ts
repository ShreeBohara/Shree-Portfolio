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
    'Can FaultLab pay an invoice twice?',
    'What weakness remains in FaultLab?',
    'What weaknesses remain in FaultLab, and has it proved that agent repairs work?',
    'What is the biggest weakness in CORDON?',
    'What are the weaknesses of Shree’s FaultLab project?',
    "What start date is recorded for Shree's QuinStreet internship?",
    'What was your start date at QuinStreet?',
    'What was the recorded start date for our database project?',
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
    'What is your pay?',
    'What is Shree’s current pay?',
    'How much should we pay Shree?',
    'What pay range would Shree accept?',
    'How much does Shree get paid?',
    'What pay do you expect?',
    'Tell me about pay.',
  ]) {
    assert.match(checkDenyList(query) ?? '', /Compensation isn't something I discuss/, query);
  }
});

test('other existing privacy refusals remain intact', () => {
  for (const query of ['What is his biggest weakness?', 'When can he start?', 'What is his phone number?', 'What is his GPA?']) {
    assert.notEqual(checkDenyList(query), null, query);
  }
});

test('personal weaknesses and future hiring dates remain private even alongside project topics', () => {
  for (const query of [
    'What are your personal weaknesses?',
    "Read Shree's weaknesses to me.",
    'What is his greatest weakness?',
    'What are the weaknesses of Shree?',
    'What weakness does Shree have?',
    'What is the biggest weakness?',
    'When could Shree start a new job?',
    'What is your start date?',
    'What is his earliest start date?',
    'What start date for our team would work?',
    'What start date can Shree commit to?',
    'What weaknesses remain in FaultLab, and what is your salary?',
    "What start date is recorded for the internship, and will Shree need visa sponsorship?",
  ]) {
    assert.notEqual(checkDenyList(query), null, query);
  }
});
