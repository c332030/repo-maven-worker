
const repos = [
  'https://repo1.maven.org/maven2',
  'https://oss.sonatype.org/service/local/repositories/releases/content',

  'https://plugins.gradle.org/m2',

]

const urlPrefix = '://'

function getPath(url) {

  const url2 = url.substring(url.indexOf(urlPrefix) + urlPrefix.length)
  return url2.substring(url2.indexOf('/'))
}

export default {
  async fetch(request, env, ctx) {

    const path = getPath(request.url)

    for (const repo of repos) {

      const newUrl = `${repo}${path}`
      const response = await fetch(newUrl, {
        method: request.method
      })

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
