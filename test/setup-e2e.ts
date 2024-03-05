import 'dotenv/config'

import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

// function to change the database schema
function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  // subscribe Database_url the new one
  process.env.DATABASE_URL = databaseURL

  // run on terminal the migration
  execSync('npx prisma migrate deploy')
})

// delete the schema database
afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})