const request = require('request')

request({
  url: `https://api.spotify.com/v1/users/${process.env.SPOTIFY_USER}/playlists`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.SPOTIFY_TOKEN}`
  }
}, function (error, response, body) {
  if (error || response.statusCode !== 200) {
    console.error(error)
    console.error(response)
    console.error(`
  Request ended up with a ${response.statusCode} status code.
  Did you specify "SPOTIFY_USER" and "SPOTIFY_TOKEN"?
  If you want to generate a token check: https://developer.spotify.com/console/get-playlists/ with the "playlist-read-collaborative" role
`)
    process.exit(1)
    return
  }

  console.log(page({user_id: process.env.SPOTIFY_USER, playlists: JSON.parse(body).items}))
})

const page = ({user_id, playlists}) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="description" content="A list of my spotify playlists made with love">
    <meta name="keywords" content="spotify, soyuka, music, audio">
    <meta name=viewport content="width=device-width, initial-scale=1">
    <title>Spotify ${user_id} playlists</title>
  </head>
  <style>html{font-family:sans-serif}body{background:#111}a{color:#f6f6f6;text-decoration:none;margin-top:20px;margin-bottom:10px;display:block}h1{color:#f6f6f6;margin:0 auto;width:300px;text-align:center;font-size:1.2em}.block{width:300px;margin:10px auto;text-align:justify}@media (max-width: 300px){.block,h1{width:100%;padding:20px;text-align:center}}</style>
  <body>
    <h1>Spotify ${user_id} playlists</h1>
    ${playlists.map((playlist) => {
      if (playlist.public === false) {
        return ``
      }

      return `
        <div class="block">
          <a href="${playlist.external_urls.spotify}">${playlist.name}</a>
          <iframe src="https://open.spotify.com/embed/user/soyuka/playlist/${playlist.id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </div>
      `
    }).join('')}
  </body>
</html>
`
}
