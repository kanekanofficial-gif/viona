# T-Bank DEMO TLS on Render

This branch includes the user-supplied public Russian Trusted Root CA and two Russian Trusted Sub CA certificates in `certs/russian-trusted-ca-bundle.pem`.

The provided root certificate has SHA-256 fingerprint `D26D2D0231B7C39F92CC738512BA54103519E4405D68B5BD703E9788CA8ECF31`, matching the independently published public certificate record. Both intermediate certificates parsed successfully and chain to the supplied root. Before production use, validate certificate provenance from the official source and confirm the TLS endpoint's expected chain.

After merging this PR, in Render > VIONA > Environment set:

```
NODE_EXTRA_CA_CERTS=/opt/render/project/src/certs/russian-trusted-ca-bundle.pem
```

Then redeploy and retry a **DEMO** payment. This augments Node's trusted certificate authorities. It does not disable HTTPS certificate validation.

Do not use `NODE_TLS_REJECT_UNAUTHORIZED=0`. Never commit bank credentials or real payment data.
