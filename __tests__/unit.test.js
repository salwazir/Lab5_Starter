// unit.test.js

import {
  isPhoneNumber,
  isEmail,
  isStrongPassword,
  isDate,
  isHexColor,
} from '../code-to-unit-test/unit-test-me';

// ===== isPhoneNumber =====
test('isPhoneNumber accepts dashed 10-digit number', () => {
  expect(isPhoneNumber('858-555-1234')).toBe(true);
});

test('isPhoneNumber accepts parenthesized area code', () => {
  expect(isPhoneNumber('(858) 555-1234')).toBe(true);
});

test('isPhoneNumber rejects plain text', () => {
  expect(isPhoneNumber('not a phone')).toBe(false);
});

test('isPhoneNumber rejects too few digits', () => {
  expect(isPhoneNumber('555-12')).toBe(false);
});

// ===== isEmail =====
test('isEmail accepts a normal address', () => {
  expect(isEmail('solaiman@ucsd.edu')).toBe(true);
});

test('isEmail accepts a 2-letter TLD', () => {
  expect(isEmail('hello@domain.io')).toBe(true);
});

test('isEmail rejects a missing @ symbol', () => {
  expect(isEmail('solaiman.ucsd.edu')).toBe(false);
});

test('isEmail rejects a TLD that is too long', () => {
  expect(isEmail('solaiman@ucsd.eduuu')).toBe(false);
});

// ===== isStrongPassword =====
test('isStrongPassword accepts letters and digits starting with letter', () => {
  expect(isStrongPassword('Wazir2026')).toBe(true);
});

test('isStrongPassword accepts the minimum 4 character length', () => {
  expect(isStrongPassword('abcd')).toBe(true);
});

test('isStrongPassword rejects passwords starting with a digit', () => {
  expect(isStrongPassword('1Wazir')).toBe(false);
});

test('isStrongPassword rejects passwords with special characters', () => {
  expect(isStrongPassword('Wazir!!')).toBe(false);
});

// ===== isDate =====
test('isDate accepts a normal MM/DD/YYYY date', () => {
  expect(isDate('05/03/2026')).toBe(true);
});

test('isDate accepts single-digit month and day', () => {
  expect(isDate('5/3/2026')).toBe(true);
});

test('isDate rejects a date with dashes', () => {
  expect(isDate('05-03-2026')).toBe(false);
});

test('isDate rejects a 2-digit year', () => {
  expect(isDate('05/03/26')).toBe(false);
});

// ===== isHexColor =====
test('isHexColor accepts a 6 character code with hash', () => {
  expect(isHexColor('#A1B2C3')).toBe(true);
});

test('isHexColor accepts a 3 character code without hash', () => {
  expect(isHexColor('fff')).toBe(true);
});

test('isHexColor rejects letters outside the a-f range', () => {
  expect(isHexColor('#ZZZZZZ')).toBe(false);
});

test('isHexColor rejects a code of the wrong length', () => {
  expect(isHexColor('#12345')).toBe(false);
});
