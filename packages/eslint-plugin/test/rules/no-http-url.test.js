'use strict';

const rule = require('../../rules/no-http-url');
const {RuleTester} = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('no-http-url', rule, {
  // 合理写法
  valid: [
    {
      code: "var test = 'https://baidu.com';",
    },
  ],
  // 不合理写法
  invalid: [
    {
      code: "var test = 'http://baidu.com';",
      output: "var test = 'http://baidu.com';",
      errors: [
        {
          message: 'Recommended "http://baidu.com" switch to HTTPS',
        },
      ],
    }
  ],
});
