//User Token Interface
export interface IAuthToken {
  token: string,
  expiresIn: string,
  userInfo: string,
  registration: boolean
  profileImg: string
}
