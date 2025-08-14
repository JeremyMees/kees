declare module 'disconnect' {
  export interface DiscogsAuth {
    userToken?: string
    consumerKey?: string
    consumerSecret?: string
  }

  export interface CollectionOptions {
    page?: number
    per_page?: number
    sort?: string
    sort_order?: string
  }

  export interface ReleaseBasicInfo {
    id: number
    title: string
    artists: {
      name: string
      id: number
    }[]
    year: number
    cover_image: string
    formats: {
      name: string
      qty: string
      descriptions?: string[]
    }[]
    labels: {
      name: string
      id: number
    }[]
    resource_url: string
  }

  export interface CollectionRelease {
    id: number
    basic_information: ReleaseBasicInfo
    date_added: string
    notes: string
    rating: number
  }

  export interface CollectionResponse {
    pagination: {
      page: number
      pages: number
      per_page: number
      items: number
      urls: {
        first: string
        last: string
        prev?: string
        next?: string
      }
    }
    releases: CollectionRelease[]
  }

  export interface Folder {
    id: number
    name: string
    count: number
    resource_url: string
  }

  export interface FolderResponse {
    folders: Folder[]
  }

  export interface DiscogsError {
    message: string
    statusCode?: number
  }

  type CallBack = (err: DiscogsError | null, data: Buffer, rateLimit?: unknown) => void

  export default class Discogs {
    constructor (userAgent?: string, auth?: DiscogsAuth)
    static Client: new (userAgent?: string, auth?: DiscogsAuth) => Discogs

    setConfig(config: { outputFormat?: string }): this

    user(): {
      collection(): {
        getReleases(
          username: string,
          folderId: number,
          options: CollectionOptions,
          callback: (err: DiscogsError | null, data: CollectionResponse, rateLimit?: unknown) => void
        ): void
        getReleases(username: string, folderId: number, options: CollectionOptions): Promise<CollectionResponse>
        getFolders(username: string, callback: CallBack): void
        getFolders(username: string): Promise<FolderResponse>
      }
      wantlist(): {
        getReleases(
          username: string,
          options: CollectionOptions,
          callback: (err: DiscogsError | null, data: CollectionResponse, rateLimit?: unknown) => void
        ): void
        getReleases(username: string, options: CollectionOptions): Promise<CollectionResponse>
      }
    }

    database(): {
      getRelease(id: number, callback: CallBack): void
      getRelease(id: number): Promise<unknown>
      getFolders(username: string, callback: CallBack): void
      getFolders(username: string): Promise<FolderResponse>
      getArtist(id: number, callback: CallBack): void
      getArtist(id: number): Promise<unknown>
      getLabel(id: number, callback: CallBack): void
      getLabel(id: number): Promise<unknown>
      getImage(url: string, callback: CallBack): void
      getImage(url: string): Promise<Buffer>
    }

    marketplace(): {
      getListing(id: number, callback: (err: DiscogsError | null, data: unknown, rateLimit?: unknown) => void): void
      getListing(id: number): Promise<unknown>
    }

    oauth(): {
      getRequestToken(
        consumerKey: string,
        consumerSecret: string,
        callbackUrl: string,
        callback: (err: DiscogsError | null, data: unknown) => void
      ): void
      getAccessToken(
        oauthVerifier: string,
        callback: (err: DiscogsError | null, data: unknown) => void
      ): void
    }

    getIdentity(callback: CallBack): void
    getIdentity(): Promise<unknown>
  }
}
