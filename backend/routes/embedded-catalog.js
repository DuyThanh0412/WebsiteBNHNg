const mongoose = require('mongoose');

function parseEmbeddedId(id) {
  const match = /^embedded:([a-f\d]{24}):(categories|products):(\d+)$/i.exec(id);
  return match ? { parentId: match[1], field: match[2], index: Number(match[3]) } : null;
}

async function updateEmbeddedEntry(collection, parentId, field, index, value, id) {
  const document = await collection.findOne({ _id: new mongoose.Types.ObjectId(parentId) });
  if (!Array.isArray(document?.[field]) || !document[field][index]) return null;

  const { _id, ...entry } = value;
  const fields = Object.fromEntries(Object.entries(entry).map(([key, data]) => [`${field}.${index}.${key}`, data]));
  await collection.updateOne({ _id: document._id }, { $set: fields });
  return { ...document[field][index], ...entry, _id: id };
}

async function deleteEmbeddedEntry(collection, parentId, field, index) {
  const document = await collection.findOne({ _id: new mongoose.Types.ObjectId(parentId) });
  if (!Array.isArray(document?.[field]) || !document[field][index]) return false;

  document[field].splice(index, 1);
  await collection.updateOne({ _id: document._id }, { $set: { [field]: document[field] } });
  return true;
}

module.exports = { parseEmbeddedId, updateEmbeddedEntry, deleteEmbeddedEntry };
