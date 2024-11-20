'use strict'

const fs = require('fs-extra')
const path = require('path')


const deleteFilesRecursively = async (folderPath) => {
  const items = await fs.readdir(folderPath)

  for (const item of items) {
    const itemPath = path.join(folderPath, item)
    const stat = await fs.stat(itemPath)

    if (stat.isDirectory()) {
      await deleteFilesRecursively(itemPath)

    } else {
      await fs.remove(itemPath)

    }
  }
}

module.exports = deleteFilesRecursively
