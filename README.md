# Push to SFTP

This action uploads an entire directory to your remote SFTP server on push.

## Inputs

<!-- TODO: -->

## `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

none

## Example usage

uses: actions/hello-world-javascript-action@v1.1
with:
  who-to-greet: 'Mona the Octocat'

## Feature Wishlist

- [ ] only upload modified files
- [ ] exclude files