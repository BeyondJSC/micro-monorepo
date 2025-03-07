import { createRequest } from '@mmrepo/request'

const request = createRequest()

request
  .http<{ msg: string }>({
    url: 'xxx'
  })
  .then((data) => {})
