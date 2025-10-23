import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description?: string;
  status: 'active' | 'completed';
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });



const Project =  mongoose.model<IProject>('Project', ProjectSchema);;
module.exports = Project;

