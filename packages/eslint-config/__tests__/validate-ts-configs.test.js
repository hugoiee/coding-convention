/**
 * 验证 TS 规则
 */

const assert = require('assert');
const eslint = require('eslint');
const path = require('path');
const sumBy = require('lodash/sumBy');

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

describe('Validate TS configs', () => {
  it('Validate encode-fe-eslint-config/typescript', async () => {
    const configPath = './typescript/index.js';
    const filePath = path.join(__dirname, './fixtures/ts.ts');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      useEslintrc: false,
      ignore: false,
      overrideConfig: {
        parserOptions: {
          project: path.join(__dirname, './fixtures/tsconfig.json'),
        },
      },
    });

    // 验证导出的 config 是否正常
    const config = cli.calculateConfigForFile(filePath);
    assert.ok(isObject(config));

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.notEqual(sumBy(results, 'errorCount'), 0);
    assert.equal(sumBy(results, 'warningCount'), 0);

    // 验证 eslint-plugin-typescript 工作是否正常
    const { messages } = results[0];
    const errorReportedByReactPlugin = messages.filter((result) => {
      return result.ruleId && result.ruleId.indexOf('@typescript-eslint/') !== -1;
    });
    assert.notEqual(errorReportedByReactPlugin.length, 0);

    const errorReportedByNoRedeclare = messages.filter((result) => {
      return result.ruleId === 'no-redeclare';
    });
    assert.equal(errorReportedByNoRedeclare.length, 0);

    // 验证 eslint-import-resolver-typescript 工作是否正常
    const filePath2 = path.join(__dirname, './fixtures/ts-import-a.ts');
    const filePath3 = path.join(__dirname, './fixtures/ts-import-b.ts');
    const reports2 = cli.lintFiles([filePath2, filePath3]);
    assert.ok(reports2.errorCount !== 0 || reports2.warnCount !== 0);
  });

  it('Validate encode-fe-eslint-config/essential/typescript', async () => {
    const configPath = './essential/typescript/index.js';
    const filePath = path.join(__dirname, './fixtures/ts.ts');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      useEslintrc: false,
      ignore: false,
      overrideConfig: {
        parserOptions: {
          project: path.join(__dirname, './fixtures/tsconfig.json'),
        },
      },
    });

    // 验证导出的 config 是否正常
    const config = await cli.calculateConfigForFile(filePath);
    assert.ok(isObject(config));

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.notEqual(sumBy(results, 'errorCount'), 0);
    assert.notEqual(sumBy(results, 'warningCount'), 0);

    // 验证黑名单中的规则已关闭
    const { messages } = results[0];

    // 验证 @typescript-eslint/semi 被关闭
    const semiErrors = messages.filter((result) => {
      return result.ruleId === '@typescript-eslint/semi';
    });
    assert.equal(semiErrors.length, 0);

    // 验证一个风格问题被降级
    const styleErrors = messages.filter((result) => {
      return result.ruleId === 'object-curly-spacing';
    });
    assert.equal(styleErrors[0].severity, 1);
  });

  it('Validate encode-fe-eslint-config/essential/typescript/react', async () => {
    const configPath = './essential/typescript/react.js';
    const filePath = path.join(__dirname, './fixtures/ts-react.tsx');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      useEslintrc: false,
      ignore: false,
      overrideConfig: {
        parserOptions: {
          project: path.join(__dirname, './fixtures/tsconfig.json'),
        },
      },
    });

    // 验证导出的 config 是否正常
    const config = await cli.calculateConfigForFile(filePath);
    assert.ok(isObject(config));

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.notEqual(sumBy(results, 'errorCount'), 0);
    assert.notEqual(sumBy(results, 'warningCount'), 0);

    // 验证对 tsx 工作是否正常
    const { messages } = results[0];
    const errorReportedByReactPlugin = messages.filter((result) => {
      return result.ruleId && result.ruleId.indexOf('react/') !== -1;
    });
    assert.notEqual(errorReportedByReactPlugin.length, 0);
    const errorReportedByTSPlugin = messages.filter((result) => {
      return result.ruleId && result.ruleId.indexOf('@typescript-eslint/') !== -1;
    });
    assert.notEqual(errorReportedByTSPlugin.length, 0);

    // 验证 @typescript-eslint/semi 被关闭
    const semiErrors = messages.filter((result) => {
      return result.ruleId === '@typescript-eslint/semi';
    });
    assert.equal(semiErrors.length, 0);

    // 验证黑名单中的规则已关闭，取 react/jsx-indent 进行测试
    const errorReportedByReactPluginBlackList = messages.filter((result) => {
      return result.ruleId === 'react/jsx-indent';
    });
    assert.equal(errorReportedByReactPluginBlackList.length, 0);
  });
  
});
