'use strict';

const express = require('express');
const app = express();
const PORT = 3000;
const superagent = require('superagent');

app.use(express.static('./public'));

const linkedinToken = 'https://www.linkedin.com/oauth/v2/accessToken'
const linkedinAPI = 'https://api.linkedin.com/v2/me'
const LINKEDIN_CLIENT_SECRET= 'rRp7S37b6gSLVwXH';
const LINKEDIN_CLIENT_ID = '86p5hspkb9vrbl';
const API_URL = 'http://localhost:3000/oauth';

app.get('/oauth', authorize);

function authorize(request, response) {

  let code = request.query.code;
  console.log(request.query.code);
  console.log('1) coderecieved: ', code);
  return superagent.post(linkedinToken)
    .type('form')
    .send({
      code: code,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
      redirect_uri: API_URL,
      grant_type: 'authorization_code',
    })
    .then(response => {
      let access_token = response.body.access_token;
      console.log('access token recieved', access_token);
      return access_token;
    })
    .then(token => {
      return superagent.get(linkedinAPI)
        .set('Authorization', `Bearer ${token}`)
    })
    .then(response => {
      let user = response.body;
      console.log('3) here is our user', user);
      response.status(200).json(user);

    })
    .catch(e => response.send(e));
}

app.listen(PORT, () => {
  console.log('Web Server up on port', PORT);
});
