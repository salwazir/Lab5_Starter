# Lab 5 - JavaScript DOM Basics and GitHub Actions

**Name:** Solaiman Alwazir
**Lab partner(s):** none

## GitHub Pages

- Expose (Party Horn): https://salwazir.github.io/Lab5_Starter/expose.html
- Explore (Speech Synthesis): https://salwazir.github.io/Lab5_Starter/explore.html

## Check Your Understanding

### 1) Would you use a unit test to test the "message" feature of a messaging application? Why or why not?

Not really, at least not as the only kind of test. Sending a message in a real messaging app touches an input field, the network, a server-side write, push delivery, and the receiver's UI rendering — none of which fits inside an isolated unit. A unit test runs synchronously in Node and can't meaningfully exercise that whole path, so it would either mock so much that it tests almost nothing, or pretend a thin slice represents the feature. The right way to cover "send a message" is with integration / end-to-end tests that drive the real flow. That said, individual *pieces* underneath the feature are great unit-test targets — a function that validates the message body, one that builds the request payload, one that formats a timestamp. Those are pure input/output and easy to lock down with unit tests.

### 2) Would you use a unit test to test the "max message length" feature of a messaging application? Why or why not?

Yes — this is the textbook case for a unit test. Enforcing a max length is a single pure function: take a string, return whether it is allowed (or how it should be truncated). No network, no DOM, no clock, nothing async. You can write deterministic tests in seconds: a string of exactly 80 characters should pass, 81 should fail, an empty string should be handled deliberately, and an emoji should count by characters or code points the way the product actually intends (a single emoji can be multiple UTF-16 code units, which is a classic off-by-one trap). Because the rule is small and the inputs are easy to enumerate, unit tests catch regressions cheaply every time the function is touched.
