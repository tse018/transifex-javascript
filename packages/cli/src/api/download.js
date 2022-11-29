const axios = require('axios');
const { version } = require('../../package.json');
const { sleep } = require('./utils');

/**
 * Download languages
 *
 * @param {*} { cdsHost, token, secret }
 * @return {Promise}
 */
async function downloadLanguages({ cdsHost, token, secret }) {
  let response;
  let lastResponseStatus = 202;
  while (lastResponseStatus === 202) {
    /* eslint-disable no-await-in-loop */
    response = await axios.get(`${cdsHost}/languages`, {
      headers: {
        Authorization: `Bearer ${token}:${secret}`,
        'Accept-version': 'v2',
        'Content-Type': 'application/json;charset=utf-8',
        'X-NATIVE-SDK': `txjs/cli/${version}`,
      },
    });
    lastResponseStatus = response.status;
    if (lastResponseStatus === 202) {
      await sleep(1000);
    }
    /* eslint-enable no-await-in-loop */
  }

  return response.data;
}

/**
 * Download phrases
 *
 * @param {*} {
 *   cdsHost, locale, filterTags, token, secret,
 * }
 * @return {Promise}
 */
async function downloadPhrases({
  cdsHost, locale, filterTags, token, secret,
}) {
  let response;
  let lastResponseStatus = 202;
  while (lastResponseStatus === 202) {
    let url = `${cdsHost}/content/${locale}`;
    if (filterTags) {
      url = `${url}?filter[tags]=${filterTags}`;
    }
    /* eslint-disable no-await-in-loop */
    response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}:${secret}`,
        'Accept-version': 'v2',
        'Content-Type': 'application/json;charset=utf-8',
        'X-NATIVE-SDK': `txjs/cli/${version}`,
      },
    });
    lastResponseStatus = response.status;
    if (lastResponseStatus === 202) {
      await sleep(1000);
    }
    /* eslint-enable no-await-in-loop */
  }

  return response.data;
}

module.exports = {
  downloadPhrases,
  downloadLanguages,
};
