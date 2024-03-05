import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-reepository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase // sut => system under test

describe('Fetch Recent Questions Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('it should be able to fetch a recent questions', async () => {
    // create a lot of questions
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 1, 23) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 1, 18) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 1, 10) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    // expect return higher to lower
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 1, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 1, 18) }),
      expect.objectContaining({ createdAt: new Date(2024, 1, 10) }),
    ])
  })

  it('it should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      // create a lot of questions
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const result = await sut.execute({
      page: 2,
    })

    // expect return two pages
    expect(result.value?.questions).toHaveLength(2)
  })
})
