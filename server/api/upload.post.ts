import path from 'path'
import { readFiles } from 'h3-formidable'

export default defineEventHandler(async (event) => {
  const { fields, files, form } = await readFiles(event, {
  })
  return files
})
