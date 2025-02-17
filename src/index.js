
const repos = [

  'https://repo1.maven.org/maven2',

  'https://plugins.gradle.org/m2',

  'https://oss.sonatype.org/service/local/repositories/releases/content',

]

const hiddenErrorCodes = [
  401
]

const urlPrefix = '://'

function getPath(url) {

  const url2 = url.substring(url.indexOf(urlPrefix) + urlPrefix.length)
  return url2.substring(url2.indexOf('/'))
}

function assign(obj1, obj2) {
  return Object.assign({}, obj1, obj2)
}

export default {
  async fetch(request, env, ctx) {

    const path = getPath(request.url)

    const failResponses = []
    for (const repo of repos) {

      const newUrl = `${repo}${path}`
      console.debug('newUrl', newUrl)

      const headers = request.headers
      console.debug('headers', headers)

      const response = await fetch(newUrl, {
        method: request.method,
        redirect: 'follow',
        headers: headers,
      })
      console.debug('response', response)

      const ok = response.ok
      console.debug('ok', ok)
      if(ok) {
        const headers = {
          'c-repo': repo,
          'c-url': response.url,
        }

        for (const pair of response.headers.entries()) {
          headers[pair[0]] = pair[1]
        }

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        })
      }

      failResponses.push(response)

    }

    for (const res of failResponses) {
      if(hiddenErrorCodes.includes(res.status)) {
        continue
      }
      return res;
    }

    return new Response(`${path} not found.`, {
      status: 404,
    });
  }
};
