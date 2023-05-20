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

`curl -v -X POST http://127.0.0.1:8089/api/wallets/$(curl -X POST http://127.0.0.1:8089/api/wallets -d '{"description": "test"}' | jq '.walletId' -r)/currencies  -d '{"value": 10, "ticker": "RON"}'`
