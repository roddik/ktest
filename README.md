# Installation

* `git clone git@github.com:roddik/ktest.git`
* `npm install`
* Create local-config.yaml (path can be changed and then provided with `-c`), with an array of shop definitions, e.g.:
```
---
  shops:
    -
      shopname: "someshop"
      url: "http://url.to.csv"
      delimiter: ";"
      product_id_column: "PZN"
      price_column: "Preis"
```
* `node start.js` # try with -h

# Testing

* npm test

# Running

* Fetch price: `/?shop=someshop&product_id=123`
* Refreshing price: `/refresh`