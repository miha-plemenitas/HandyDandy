import { connectDB } from '@/utils/db';
import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  recommendedStores: [String],
  category: String,
});

const Tool = mongoose.models.Tool || mongoose.model('Tool', toolSchema);

export async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  try {
    if (id) {
      const tool = await Tool.findById(id);
      if (!tool) return Response.json({ error: 'Tool not found' }, { status: 404 });
      return Response.json(tool);
    } else {
      const tools = await Tool.find();
      return Response.json(tools);
    }
  } catch {
    return Response.json({ error: 'Error fetching tool(s).' }, { status: 500 });
  }
}
