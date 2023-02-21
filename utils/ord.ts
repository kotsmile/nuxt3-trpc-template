import axios from 'axios'

export const ORD_API = 'https://ordapi.xyz/'

export const ordApi = axios.create({
  baseURL: ORD_API,
})

export interface Inscription {
  address: string
  content: string
  'content length': string
  'content type': string
  'genesis fee': string
  'genesis height': string
  'genesis transaction': string
  id: string
  inscription_number: number
  location: string
  offset: string
  output: string
  'output value': string
  preview: string
  sat: string
  timestamp: string
  title: string
}

export const getInscription = async (inscriptionId: number) => {
  return await ordApi.get<Inscription>(`/inscription/${inscriptionId}`)
}

export const getContent = async (inscriptionId: number) => {
  return await ordApi.get(`/content/${inscriptionId}`)
}

export const getPreview = async (inscriptionId: number) => {
  return await ordApi.get(`/preview/${inscriptionId}`)
}
