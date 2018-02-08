// interface for a basic proposal
//TODO update interface by adding optionals "?".
export interface IProposal {
      _id: Number,
      proposalNo?: Number,
      proposalUrls?: String,
      proposalStatus?: String,
      sector: String,
      client: String,
      owner: String,
      ownerEmail: string,
      proposalTitle: String,
      proposalRegion: String,
      proposalIssueDate?: Date,
      clientContact: String,
      responseDate?: Date,

      currency?: String,
      totalNumberOfDays: Number,
      dailyRate: Number,
      expenses: Number,
      totalValue: Number,

      dateCreated?: Date
}
