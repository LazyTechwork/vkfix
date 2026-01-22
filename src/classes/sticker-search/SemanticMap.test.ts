import { describe, it, expect } from 'vitest'
import { SemanticMap } from './SemanticMap'

describe('SemanticMap', () => {
  it('должен найти синонимы для "кек"', () => {
    const semanticMap = SemanticMap.getInstance()
    const synonyms = semanticMap.getSynonyms('кек')
    
    console.log('Синонимы для "кек":', Array.from(synonyms))
    
    expect(synonyms.size).toBeGreaterThan(0)
    expect(synonyms.has('смех')).toBe(true)
    expect(synonyms.has('ржач')).toBe(true)
    expect(synonyms.has('лол')).toBe(true)
  })

  it('должен найти синонимы для "смех"', () => {
    const semanticMap = SemanticMap.getInstance()
    const synonyms = semanticMap.getSynonyms('смех')
    
    console.log('Синонимы для "смех":', Array.from(synonyms))
    
    expect(synonyms.size).toBeGreaterThan(0)
    expect(synonyms.has('кек')).toBe(true)
    expect(synonyms.has('ржач')).toBe(true)
  })

  it('должен найти синонимы для "ржач"', () => {
    const semanticMap = SemanticMap.getInstance()
    const synonyms = semanticMap.getSynonyms('ржач')
    
    console.log('Синонимы для "ржач":', Array.from(synonyms))
    
    expect(synonyms.size).toBeGreaterThan(0)
    expect(synonyms.has('кек')).toBe(true)
    expect(synonyms.has('смех')).toBe(true)
  })
})
