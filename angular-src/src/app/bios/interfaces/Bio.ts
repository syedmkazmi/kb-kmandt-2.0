export interface IBio {
  _id?: string;
  firstName: string,
  lastName: string,
  jobTitle: string,
  userID: string,
  photo: string,
  region: string,
  lineManagerEmail: string,
  bioStatus: string,
  bioForSector: string,
  background: string,
  skills: [string],
  otherSkills: string,
  experience: {},
  approvalStage: string,
  rejectionFeedback: string,
  rejectedBy: string,
  dateCreated: Date,
  iconOne: string,
  iconTwo: string,
  iconThree: string,
  iconFour: string
}
