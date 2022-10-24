import http from 'node:http'
import net from 'node:net'
import {strict as assert} from 'node:assert'

import httpMocks from 'node-mocks-http'

import BaseHandler from '../lib/handlers/BaseHandler'
import DataStore from '../lib/stores/DataStore'

describe('BaseHandler', () => {
  const store = new DataStore()
  const handler = new BaseHandler(store, {path: '/test/output'})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let res: httpMocks.MockResponse<any>

  beforeEach(() => {
    const req = new http.IncomingMessage(new net.Socket())
    req.method = 'GET'
    res = httpMocks.createResponse({req})
  })

  it('constructor must require a DataStore', (done) => {
    assert.throws(() => {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
      new BaseHandler()
    }, Error)
    done()
  })

  it('write() should end the response', (done) => {
    handler.write(res, 200, {})
    assert.equal(res.finished, true)
    done()
  })

  it('write() should set a response code', (done) => {
    handler.write(res, 201, {})
    assert.equal(res.statusCode, 201)
    done()
  })

  it('write() should set headers', (done) => {
    const header = 'Access-Control-Allow-Methods'
    const headers = {[header]: 'GET, OPTIONS'}
    handler.write(res, 200, headers)
    assert.equal(res.getHeader(header), headers[header])

    done()
  })

  it('write() should write the body', (done) => {
    const body = 'Hello tus!'
    handler.write(res, 200, {}, body)
    const output = res._getData()
    assert.equal(output.match(/Hello tus!$/).index, output.length - body.length)
    done()
  })
})
