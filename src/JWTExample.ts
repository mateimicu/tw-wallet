import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

// sign with RSA SHA256
const privateKey = fs.readFileSync('jwtRSA256-private.pem');
const token = jwt.sign({ foo: 'bar', scope: "ana" }, privateKey, { algorithm: 'RS256' });
console.log(token)

const cert = fs.readFileSync('jwtRSA256-public.pem');  // get public key
const resp = jwt.verify(token, cert);
console.log(resp);
