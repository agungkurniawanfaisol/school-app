import { describe, it, expect, beforeAll } from 'vitest'
import i18n, { loadLocale } from './i18n'

describe('i18n configuration', () => {
  beforeAll(async () => {
    await loadLocale('en')
    await loadLocale('ar')
    await loadLocale('ja')
    await i18n.changeLanguage('id')
  })

  it('has Indonesian as default language', () => {
    expect(i18n.language).toBe('id')
  })

  it('has fallback language set to id', () => {
    expect(i18n.options.fallbackLng).toEqual(['id'])
  })

  it('has all required namespaces', () => {
    const ns = i18n.options.ns
    expect(ns).toContain('landing')
    expect(ns).toContain('layout')
    expect(ns).toContain('pages')
    expect(ns).toContain('admin')
  })

  it('loads Indonesian landing translations', () => {
    const heroWelcome = i18n.t('hero.welcome', { ns: 'landing', lng: 'id' })
    expect(heroWelcome).toBe('Selamat Datang di')
  })

  it('loads English landing translations', () => {
    const heroWelcome = i18n.t('hero.welcome', { ns: 'landing', lng: 'en' })
    expect(heroWelcome).toBe('Welcome to')
  })

  it('loads Arabic landing translations', () => {
    const heroWelcome = i18n.t('hero.welcome', { ns: 'landing', lng: 'ar' })
    expect(heroWelcome).toBe('مرحباً بكم في')
  })

  it('loads Japanese landing translations', () => {
    const heroWelcome = i18n.t('hero.welcome', { ns: 'landing', lng: 'ja' })
    expect(heroWelcome).toBe('ようこそ')
  })

  it('loads layout translations for all locales', () => {
    expect(i18n.t('nav.home', { ns: 'layout', lng: 'id' })).toBe('Beranda')
    expect(i18n.t('nav.home', { ns: 'layout', lng: 'en' })).toBe('Home')
    expect(i18n.t('nav.home', { ns: 'layout', lng: 'ar' })).toBe('الرئيسية')
    expect(i18n.t('nav.home', { ns: 'layout', lng: 'ja' })).toBe('ホーム')
  })

  it('loads pages translations for all locales', () => {
    expect(i18n.t('common.loading', { ns: 'pages', lng: 'id' })).toBe('Memuat...')
    expect(i18n.t('common.loading', { ns: 'pages', lng: 'en' })).toBe('Loading...')
    expect(i18n.t('common.loading', { ns: 'pages', lng: 'ar' })).toBe('جاري التحميل...')
    expect(i18n.t('common.loading', { ns: 'pages', lng: 'ja' })).toBe('読み込み中...')
  })

  it('loads admin translations for all locales', () => {
    expect(i18n.t('nav.dashboard', { ns: 'admin', lng: 'id' })).toBe('Dashboard')
    expect(i18n.t('nav.dashboard', { ns: 'admin', lng: 'en' })).toBe('Dashboard')
    expect(i18n.t('common.save', { ns: 'admin', lng: 'id' })).toBe('Simpan')
    expect(i18n.t('common.save', { ns: 'admin', lng: 'en' })).toBe('Save')
    expect(i18n.t('common.save', { ns: 'admin', lng: 'ar' })).toBe('حفظ')
    expect(i18n.t('common.save', { ns: 'admin', lng: 'ja' })).toBe('保存')
    expect(i18n.t('pages.news.listTitle', { ns: 'admin', lng: 'ar' })).toMatch(/[\u0600-\u06FF]/)
    expect(i18n.t('pages.news.listTitle', { ns: 'admin', lng: 'ja' })).toMatch(/[\u3040-\u30FF\u4E00-\u9FFF]/)
  })

  it('has matching admin keys across all locales', () => {
    const idKeys = Object.keys(i18n.getResourceBundle('id', 'admin') ?? {}).sort()
    for (const lng of ['en', 'ar', 'ja'] as const) {
      const keys = Object.keys(i18n.getResourceBundle(lng, 'admin') ?? {}).sort()
      expect(keys).toEqual(idKeys)
    }
  })

  it('can switch language', async () => {
    await i18n.changeLanguage('en')
    expect(i18n.language).toBe('en')

    const result = i18n.t('hero.welcome', { ns: 'landing' })
    expect(result).toBe('Welcome to')

    await i18n.changeLanguage('id')
    expect(i18n.language).toBe('id')
  })
})
