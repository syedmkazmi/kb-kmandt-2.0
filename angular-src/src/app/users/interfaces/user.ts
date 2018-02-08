// interface for a basic user profile
export interface IUser {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  jobTitle: string,
  photo: string,
  startDate: {type: Date},
  birthday: {type: Date},
  lastLogin?: {type: Date},

  region: string,
  sector: string,

  usersProposals?: [string],
  isLineManager: string
  lineManagerEmail: string,
  accessLevel: [string],

  biosPending?: [string],

  caseStudyPending?: [string],

  accountVerified: string
}
