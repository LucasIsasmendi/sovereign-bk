import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Ballot = new SimpleSchema({
  _id: {
    type: String
  },
  mode: {
    type: String
  },
  rank: {
    type: Number,
    optional: true
  },
  url: {
    type: String,
    optional: true
  },
  label: {
    type: String,
    optional: true
  }
});
