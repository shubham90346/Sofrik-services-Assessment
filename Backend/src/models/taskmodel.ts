import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: Date;
  project: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  dueDate: { type: Date },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
}, { timestamps: true });



const Task = mongoose.model<ITask>('Task', TaskSchema);
module.exports = Task;
