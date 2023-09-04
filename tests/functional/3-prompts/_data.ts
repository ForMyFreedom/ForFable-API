import { ApiClient } from '@japa/api-client/build/src/client'
import { PromptValidatorSchema } from 'App/Validators/PromptValidator'
import { postGenre } from '../2-genres/_data'
import { postWithAuth } from '../_utils/basic-auth-requests'
import Prompt from 'App/Models/Prompt'
import { reverseSerializate } from '../_utils/serializer'

export const BASE_URL = '/api/prompt'

export const SAMPLE_PROMPT: typeof PromptValidatorSchema.props = {
	title: "O aaaa",
	text: "Bom dia",
	maxSizePerExtension: 50,
	limitOfExtensions: 5,
	genreIds: [1],
	concluded: undefined
}

export const EDIT_SAMPLE_PROMPT: Partial<typeof PromptValidatorSchema.props> = {
	concluded: true,
	text: "Opa"
}

export const WRONG_SAMPLE_PROMPT = {
	title: "O aaaa",
	maxSizePerExtension: 50,
	limitOfExtensions: 5,
	genreIds: [1],
	concluded: undefined
}

export const postPrompt = async (client: ApiClient, isAdmin: boolean = true) => {
  await postGenre(client)
  const toUseResponse = await postWithAuth(BASE_URL, client, isAdmin, SAMPLE_PROMPT)
  return reverseSerializate(toUseResponse.body().data) as Prompt
}