# tw-auth

Next:

- [ ] [pt student] terminat rutele
- [ ] [pt *] autentificare. Pentru ce ? Ce fel de autentificate ? BasicAuth si/sau JWT
- [ ] [pt *] UI cu fetch wallets din JS

Extras:

- [ ] OpenAPI UI integrated
- [ ] Business nou ? Tranzactii
- [ ] GraphQL

# Docs

`curl -v -X POST http://127.0.0.1:8089/api/wallet/$(curl -X POST http://127.0.0.1:8089/api/wallet -d 'descriere=test' | jq '.walletId' -r)/XXX  -d '{"value": 10}'`
