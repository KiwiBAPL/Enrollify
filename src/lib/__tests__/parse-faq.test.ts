import { describe, expect, it } from 'vitest'
import { parseFaqText, splitFaqAnswerParagraphs } from '@/lib/parse-faq'

describe('parseFaqText', () => {
  it('returns empty array for null, undefined, or blank input', () => {
    expect(parseFaqText(null)).toEqual([])
    expect(parseFaqText(undefined)).toEqual([])
    expect(parseFaqText('')).toEqual([])
    expect(parseFaqText('   \n  ')).toEqual([])
  })

  it('parses a single Q/A block', () => {
    const raw = `What is a frontier model?
A frontier model is a large AI system at the cutting edge of capability.`

    expect(parseFaqText(raw)).toEqual([
      {
        question: 'What is a frontier model?',
        answer: 'A frontier model is a large AI system at the cutting edge of capability.',
      },
    ])
  })

  it('parses multiple blocks separated by blank lines', () => {
    const raw = `What is a frontier model?
A frontier model is a large AI system.

Who regulates AI in New Zealand?
The National Cyber Security Centre provides guidance.`

    expect(parseFaqText(raw)).toEqual([
      {
        question: 'What is a frontier model?',
        answer: 'A frontier model is a large AI system.',
      },
      {
        question: 'Who regulates AI in New Zealand?',
        answer: 'The National Cyber Security Centre provides guidance.',
      },
    ])
  })

  it('trims leading and trailing whitespace on lines', () => {
    const raw = `  What is X?  
  Answer line one.  
  Answer line two.  `

    expect(parseFaqText(raw)).toEqual([
      {
        question: 'What is X?',
        answer: 'Answer line one.\nAnswer line two.',
      },
    ])
  })

  it('parses question and answer in separate paragraphs', () => {
    const raw = `What is a frontier AI model?

A frontier AI model is a highly capable system.

Why are frontier AI models treated as national security assets?

Governments see advanced AI as a dual-use technology.`

    expect(parseFaqText(raw)).toEqual([
      {
        question: 'What is a frontier AI model?',
        answer: 'A frontier AI model is a highly capable system.',
      },
      {
        question: 'Why are frontier AI models treated as national security assets?',
        answer: 'Governments see advanced AI as a dual-use technology.',
      },
    ])
  })

  it('skips orphan questions with no following answer', () => {
    const raw = `Orphan question?

Valid question?
Valid answer.`

    expect(parseFaqText(raw)).toEqual([{ question: 'Valid question?', answer: 'Valid answer.' }])
  })

  it('preserves multi-line answers within a block', () => {
    const raw = `How does it work?
Line one of the answer.
Line two of the answer.`

    expect(parseFaqText(raw)).toEqual([
      {
        question: 'How does it work?',
        answer: 'Line one of the answer.\nLine two of the answer.',
      },
    ])
  })

  it('parses single-newline-separated pairs without blank lines', () => {
    const raw = `Question 1?
Answer one
Question 2?
Answer two`

    expect(parseFaqText(raw)).toEqual([
      { question: 'Question 1?', answer: 'Answer one' },
      { question: 'Question 2?', answer: 'Answer two' },
    ])
  })

  it('skips a question immediately followed by another question', () => {
    const raw = `Orphan question?
Valid question?
Valid answer.`

    expect(parseFaqText(raw)).toEqual([{ question: 'Valid question?', answer: 'Valid answer.' }])
  })
})

describe('splitFaqAnswerParagraphs', () => {
  it('splits answer on blank lines', () => {
    expect(splitFaqAnswerParagraphs('First paragraph.\n\nSecond paragraph.')).toEqual([
      'First paragraph.',
      'Second paragraph.',
    ])
  })

  it('returns single paragraph when no blank lines', () => {
    expect(splitFaqAnswerParagraphs('One paragraph only.')).toEqual(['One paragraph only.'])
  })
})
