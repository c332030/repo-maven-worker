
const repos = [
  'https://repo1.maven.org/maven2',
  'https://oss.sonatype.org/service/local/repositories/releases/content',

  'https://plugins.gradle.org/m2/',

]

const urlPrefix = '://'

function getPath(url) {

  const url2 = url.substring(url.indexOf(urlPrefix) + urlPrefix.length)
  return url2.substring(url2.indexOf('/'))
}

export default {
  async fetch(request, env, ctx) {

    if (request.method !== "GET") {
      return new Response(`Method ${request.method} not allowed.`, {
        status: 405,
        headers: {
          Allow: "GET",
        },
      })
    }

    console.debug('url', request.url)

    const path = getPath(request.url)
    console.debug('path', path)

    for (const repo of repos) {

      const newUrl = `${repo}${path}`
      console.debug('newUrl', newUrl)

      const response = await fetch(newUrl)
      console.debug('response', response)

      console.debug('response.ok', response.ok)
      if(response.ok) {
        return response
      }

    }

    return new Response(`Resource ${path} not found.`, {
      status: 404,
      headers: {
        Allow: "GET",
      },
    })
  }
};
