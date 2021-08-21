# Push to SFTP

This action uploads an entire directory to your remote SFTP server on push.

## Inputs

_(all default to an empty string)_

| Name      | Required? | Description                                                                     |
| --------- | --------- | ------------------------------------------------------------------------------- |
| host      | yes       | SFTP server                                                                     |
| port      | yes       | SFTP server port                                                                |
| username  | yes       | SFTP username                                                                   |
| password  | yes       | SFTP password                                                                   |
| sourceDir | yes       | Source directory to upload from (will upload all files in this directory)       |
| targetDir | yes       | Remote directory to upload to (WARNING: overwrites ALL files in this directory) |

## Example usage

```yml
uses: AbleLincoln/push-to-sftp@v1.0
with:
    host: example.com
    port: 22
    username: root
    password: ${{ secrets.password }}
    sourceDir: ./app/src/
    targetDir: ./html/
```

## Feature Wishlist

- [ ] only upload modified files
- [ ] exclude files
