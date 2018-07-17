const express = require('express')
const app = express();
var Http = require('http');

const port = process.env.PORT || 8880;

app.get('/', (req, res) => {
    var req = Http.request({
        host: 'http://gmdvproxy.acml.com',
        // proxy IP
        port: 8080,
        // proxy port
        method: 'GET',
        path: 'http://10.82.184.75:8880/test' // full URL as path
    }, function (res) {
        res.on('data', function (data) {
            console.log(data.toString());
        });
    });

    req.end();
    res.send('req sent');
});
app.post('/webhook/api', (req, res) => {
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    res.send('Hello World!')
});

curl -X POST \
  http://10.82.185.43:10086/json-data-api/sessions \
  -H 'accept: application/vnd.mstr.dataapi.v0+json' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: ed05fad4-fd4e-4095-00a7-f0334505628a' \
  -H 'x-authmode: 1' \
  -H 'x-iservername: W05D0541' \
  -H 'x-password: Password' \
  -H 'x-port: 34952' \
  -H 'x-projectname: AB Intelligence' \
  -H 'x-username: Test_voice'

curl -X POST \
  'http://10.82.185.43:10086/json-data-api/reports/30482C1945D0C6D0AC3D2AB55F293A05/instances?offset=0&limit=1000' \
  -H 'accept: application/vnd.mstr.dataapi.v0+json' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/vnd.mstr.dataapi.v0+json' \
  -H 'postman-token: 2511ea04-b289-4a1c-fff3-994af7e391da' \
  -H 'x-mstr-authtoken: 1.000000016752eccc229493c495b09dccd6bf4d41ec0f8c1cc6525096eadc6a1ba929479002c86b66b5f0d93c7428e8886a027ccc210aa2d6ccf3ad464e2c81a56ce1710ab7c69fa4536c0f87bd45534946162e591bcf85b58ab6dcf9eb444e31683da611eb945428ef10e33777d9678a5afc18dfb66881c41f8af71dd4adbd1caf9f.1033.0.1.America/New*_York.pidn2*_1.000000012272e238331d450c8442e38d6daf9c8413f79cfa90894057267e6a31f8e76bf879ad94ee85b11b6fafa08f34fff78f2df9e12328be229e72.34952.1.1.AB Intelligence.9995BC3F479DEB14F16667AAA6BBCBD0.0-1033.1.1_-0.1.0_-1033.1.1_10.1.0.*0.00000001fdc2fadc74ca50ad5806b07196e68699c911585ad5641ce6d7c3752e8eb9ffc79d448703.0..8.10*.4*.0002*.0049J.e.00000001ea71815bec08c329fd535df1a5dfd531c911585a63298fc12a21fa5abd98cc9d79b58a34.0'
curl -X GET \
  'http://10.82.185.43:10086/json-data-api/reports/30482C1945D0C6D0AC3D2AB55F293A05/instances/622EB2D74FF679527428ECB6C3AF999E?offset=0&limit=1000' \
  -H 'accept: application/vnd.mstr.dataapi.v0+json' \
  -H 'cache-control: no-cache' \
  -H 'postman-token: 4ba959d3-09cb-8f47-819a-c402c9423d08' \
  -H 'x-mstr-authtoken: 1.000000016752eccc229493c495b09dccd6bf4d41ec0f8c1cc6525096eadc6a1ba929479002c86b66b5f0d93c7428e8886a027ccc210aa2d6ccf3ad464e2c81a56ce1710ab7c69fa4536c0f87bd45534946162e591bcf85b58ab6dcf9eb444e31683da611eb945428ef10e33777d9678a5afc18dfb66881c41f8af71dd4adbd1caf9f.1033.0.1.America/New*_York.pidn2*_1.000000012272e238331d450c8442e38d6daf9c8413f79cfa90894057267e6a31f8e76bf879ad94ee85b11b6fafa08f34fff78f2df9e12328be229e72.34952.1.1.AB Intelligence.9995BC3F479DEB14F16667AAA6BBCBD0.0-1033.1.1_-0.1.0_-1033.1.1_10.1.0.*0.00000001fdc2fadc74ca50ad5806b07196e68699c911585ad5641ce6d7c3752e8eb9ffc79d448703.0..8.10*.4*.0002*.0049J.e.00000001ea71815bec08c329fd535df1a5dfd531c911585a63298fc12a21fa5abd98cc9d79b58a34.0'

app.listen(port, () => console.log('Example app listening on port 3000!'))
