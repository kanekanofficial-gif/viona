# T-Bank demo TLS setup

After independently verifying the certificate fingerprints, add the CA bundle at `certs/russian-trusted-ca-bundle.pem` on this branch. Set the Render environment variable `NODE_EXTRA_CA_CERTS=/opt/render/project/src/certs/russian-trusted-ca-bundle.pem`. Redeploy. Do not disable TLS verification.
