import { TestContext } from '@japa/runner'
import { ExceptionContract, deleteWithAuth, requestWithUser } from '../_utils/basic-auth-requests'
import HTTP from 'http-status-enum'
import { BASE_URL, ADMIN_USER_SAMPLE, NON_ADMIN_USER_SAMPLE, postUser } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'
import { testDELETEUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testDELETEUndefinedId } from '../_utils/basic-tests/undefined-id'
import { ConnectionType } from '../_utils/basic-tests/accepted'
import User from 'App/Models/User'

async function testUserDestroy({ client }: TestContext): Promise<void> {
  const adminUser = await postUser(client, ADMIN_USER_SAMPLE)
  const nonAdminUser = await postUser(client, NON_ADMIN_USER_SAMPLE)

  await testDELETEUndefinedId(client, BASE_URL)
  
  await testDELETEUnauthenticated(client, BASE_URL, adminUser.id)
  await testDELETEUnauthenticated(client, BASE_URL, nonAdminUser.id)
  
  await testBlockWithoutAuthorship(client, nonAdminUser.id, ConnectionType.NonAdmin)
  await testBlockWithoutAuthorship(client, adminUser.id, ConnectionType.Admin)

  await testDeleteUserAccepted(client, adminUser, ADMIN_USER_SAMPLE)
  await testDeleteUserAccepted(client, nonAdminUser, NON_ADMIN_USER_SAMPLE)
}

async function testBlockWithoutAuthorship(
  client: ApiClient, id: number, isAdmin: ConnectionType
): Promise<void> {
  let response = await deleteWithAuth(`${BASE_URL}/${id}`, client, Boolean(isAdmin))
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({error: ExceptionContract.CantDeleteOtherUser})
}

async function testDeleteUserAccepted(client: ApiClient, user: User, baseUser: { password: string }): Promise<void> {
  let response = await requestWithUser(
    `${BASE_URL}/${user.id}`,
    client.delete.bind(client),
    user.name,
    baseUser.password
  )
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains({message: ExceptionContract.SucessfullyDestroyed})
}

export default testUserDestroy