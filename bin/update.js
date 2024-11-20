#!/usr/bin/env node

'use strict'

const { updateClient, updateSpecs } = require('../src')

const main = async () => {

  await updateSpecs()
  await updateClient()
}

main()
